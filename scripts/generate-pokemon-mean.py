#!/usr/bin/env python3
"""Generate pokemon.csv with mean column from kanto.md (one-off generator)."""
import csv
import re
import unicodedata
from pathlib import Path

from mean_to_speech import mean_to_speech

ROOT = Path(__file__).resolve().parents[1]
KANTO = ROOT / "src/assets/doc/kanto.md"
CSV_IN = ROOT / "src/assets/name/pokemon.csv"
CSV_OUT = ROOT / "src/assets/name/pokemon.csv"

DIGIT_MAP = str.maketrans("𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗", "0123456789")

SEP = "-"        # đổi thành " " nếu muốn tách bằng dấu cách như skill phiên âm
Z_ONSET = "d"    # za/zu/ze/zo -> da/du/dê/dô (đổi thành "gi" nếu muốn đọc kiểu "gia")

_MORA = re.compile(r"(?:ky|gy|ny|hy|my|ry|by|py|sh|ch|ts|[kgsztdnhbpmyrwfjc])?[aeiou]")
_PARSE = re.compile(r"^(ky|gy|ny|hy|my|ry|by|py|sh|ch|ts|[kgsztdnhbpmyrwfjc]?)([aeiou]+)(.*)$")
_DIPHTHONG = {"ai", "au", "oi", "ui"}
_VOWEL = {"e": "ê", "o": "ô"}
_CODA = {"k": "c"}


def normalize_digits(s: str) -> str:
    return s.translate(DIGIT_MAP)


def nfkc(s: str) -> str:
    return unicodedata.normalize("NFKC", s)


def _onset(on: str, v: str) -> str:
    soft = v[0] in "ie"
    if on in ("k", "c"):
        return "k" if soft else "c"
    if on == "g":
        return "gh" if soft else "g"
    if on in ("s", "sh"):
        return "s"
    if on == "z":
        return Z_ONSET
    if on in ("j", "y"):
        return "gi"
    if on == "ts":
        return "x"
    if on == "d":
        return "đ"
    if on == "f":
        return "ph"
    return on  # t, ch, n, h, b, p, m, r


def _map_syl(s: str) -> str:
    m = _PARSE.match(s)
    if not m:
        return s
    on, v, coda = m.groups()

    if on == "w":                       # wa -> oa, wo -> ô, còn lại -> u + nguyên âm
        on, v = ("", "oa") if v == "a" else ("", "o") if v == "o" else ("u", v)
        out_on = on
    elif len(on) == 2 and on[1] == "y":  # kya -> kia, gyu -> ghiu, ryo -> riô
        out_on = _onset(on[0], "i")
        v = "i" + v
    else:
        out_on = _onset(on, v) if on else ""

    if out_on.endswith("i") and v.startswith("i"):  # ji -> gi (không phải gii)
        v = v[1:]

    v = "".join(_VOWEL.get(ch, ch) for ch in v)
    coda = "".join(_CODA.get(ch, ch) for ch in coda)
    return out_on + v + coda


def to_vi_read(romaji: str) -> str:
    r = re.sub(r"[^a-z]", "", romaji.lower().strip())
    if not r:
        return romaji

    # Nguyên âm dài -> nguyên âm đơn
    r = re.sub(r"aa+", "a", r)
    r = re.sub(r"ii+", "i", r)
    r = re.sub(r"uu+", "u", r)
    r = re.sub(r"ee+", "e", r)
    r = re.sub(r"oo+", "o", r)
    r = r.replace("ou", "o").replace("ei", "e")
    r = r.replace("tch", "cch")

    vowels = "aeiou"
    syllables: list[str] = []
    i = 0
    while i < len(r):
        c = r[i]

        # Phụ âm đôi: kappa -> kap-pa
        if c not in vowels and c != "n" and i + 1 < len(r) and r[i + 1] == c:
            if syllables:
                syllables[-1] += c
            i += 1
            continue

        m = _MORA.match(r, i)
        if m:
            syl = m.group()
            i = m.end()
            if syl in vowels and syllables and (syllables[-1][-1] + syl) in _DIPHTHONG:
                syllables[-1] += syl
            else:
                syllables.append(syl)
            continue

        # "n" đứng riêng: dính vào âm tiết trước
        if c == "n" and syllables:
            syllables[-1] += c
        else:
            syllables.append(c)
        i += 1

    joined = SEP.join(_map_syl(s) for s in syllables if s)
    return joined[0].upper() + joined[1:] if joined else romaji


def extract_quoted_bong(bong: str) -> str | None:
    bong = bong.strip()
    lead = re.match(r'^"([^"]+)"', bong)
    if lead:
        return lead.group(1).strip()
    for m in re.finditer(r'"([^"]+)"', bong):
        q = m.group(1).strip()
        if q.endswith("?") or q.endswith("!") or "nhé" in q.lower() or "nhỉ" in q:
            return q
    return None


def parse_paren_pair(left: str, paren: str) -> tuple[str, str] | None:
    left, paren = left.strip(), paren.strip()
    if re.fullmatch(r"[A-Za-z][A-Za-z0-9\-]*", left) and not re.fullmatch(
        r"[A-Za-z][A-Za-z0-9\-]*", paren.split(",")[0]
    ):
        return left.lower(), paren.split(",")[0].strip().lower()
    romaji = paren.split(",")[0].strip()
    if re.fullmatch(r"[A-Za-z][A-Za-z0-9\-]*", romaji):
        return romaji.lower(), left.lower()
    return None


def parse_den_parts(detail: str) -> list[tuple[str, str]]:
    """Return list of (romaji, vietnamese meaning) from Đen detail."""
    detail = detail.strip()
    if not detail:
        return []
    parts: list[tuple[str, str]] = []
    for chunk in re.split(r"\s*\+\s*", detail):
        chunk = chunk.strip()
        m = re.search(r"^(.+?)\s*\(([^)]+)\)\s*$", chunk)
        if m:
            pair = parse_paren_pair(m.group(1), m.group(2))
            if pair:
                parts.append(pair)
    return parts


def den_literal(line: str) -> tuple[str, str]:
    if "➜" in line:
        left, right = line.split("➜", 1)
        return left.replace("- Đen:", "").strip(), right.strip()
    return line.replace("- Đen:", "").strip(), ""

def join_parts(parts: list[tuple[str, str]]) -> str:
    items = [f'"{w}" nghĩa là {m}' if i == 0 else f'"{w}" là {m}' for i, (w, m) in enumerate(parts)]
    if len(items) == 1:
        return items[0]
    return ", ".join(items[:-1]) + ", và " + items[-1]

def build_mean(romaji: str, den_line: str, bong_line: str | None) -> str:
    literal, detail = den_literal(den_line)
    vi = to_vi_read(romaji)
    parts = parse_den_parts(detail)
    bong = (bong_line or "").replace("- Bóng:", "").strip() if bong_line else ""
    quoted = extract_quoted_bong(bong) if bong else None

    lit_lower = literal if literal else literal

    if len(parts) >= 2:
        head = f"{vi}, được ghép từ {join_parts(parts)}"
        if quoted:
            return f'{head}, khi kết hợp lại nghe giống câu "{quoted}".'
        if bong:
            bong_text = re.sub(r"\s+", " ", bong).strip()
            bong_text = bong_text[:1].lower() + bong_text[1:]
            return f'{head}, kết hợp thành "{lit_lower}", ngoài ra còn là {bong_text}.'
        return f'{head}, kết hợp thành "{lit_lower}".'

    if len(parts) == 1:
        w1, m1 = parts[0]
        if quoted:
            return (
                f'{vi}, từ "{w1}" nghĩa là {m1}, '
                f'khi kết hợp lại nghe giống câu "{quoted}".'
            )
        return f'{vi}, từ "{w1}" nghĩa là {m1}, hay có thể hiểu là "{lit_lower}".'

    # Fallback: one short sentence from file, no invented bóng
    detail_text = re.sub(r"\s+", " ", detail).strip()
    if detail_text:
        return f'{vi}, có nghĩa là "{lit_lower}", {detail_text}.'
    return f'{vi}, nghĩa là "{lit_lower}".'


def parse_kanto(path: Path) -> dict[int, dict]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    by_num: dict[int, dict] = {}
    current: dict | None = None

    header_re = re.compile(r"^[🍃🔥💧🐛🔘🧪⚡⛰️🌿🐞🥊🌀🪨👻🔩❄️🧚🐲].*?(\d{3,4}):\s*(.+)$")

    for raw in lines:
        line = normalize_digits(raw).strip()
        if not line:
            continue
        hm = header_re.match(nfkc(line))
        if hm:
            num = int(hm.group(1))
            current = {"num": num, "den": None, "bong": None, "romaji": None}
            by_num[num] = current
            continue
        if current is None:
            continue
        if line.startswith("✦ Phiên âm:"):
            pa = line.replace("✦ Phiên âm:", "").strip()
            romaji = pa.split()[0] if pa.split() else ""
            current["romaji"] = romaji
        elif line.startswith("- Đen:") or line.lstrip().startswith("- Đen:"):
            current["den"] = line.strip()
        elif line.startswith("- Bóng:") or line.lstrip().startswith("- Bóng:"):
            current["bong"] = line.strip()

    return by_num


def load_csv_rows(path: Path) -> list[dict]:
    content = path.read_text(encoding="utf-8")
    rows = []
    delim = "|" if "|" in content.split("\n")[0] else ","
    for line in content.strip().split("\n")[1:]:
        if not line.strip():
            continue
        parts = line.split(delim)
        if delim == "|":
            if len(parts) >= 6:
                number, name_jp, name_en, region = (
                    parts[0],
                    parts[1],
                    parts[2],
                    parts[3],
                )
            elif len(parts) >= 5:
                number, name_jp, name_en, region = parts[0], parts[1], parts[2], parts[3]
            else:
                number, name_jp, name_en, region = parts[0], parts[1], parts[2], "kanto"
        else:
            first = line.index(",")
            last = line.rindex(",")
            number, name_jp, name_en = (
                line[:first],
                line[first + 1 : last],
                line[last + 1 :],
            )
        rows.append(
            {
                "number": number,
                "name_jp": name_jp,
                "name_en": name_en,
                "region": region if delim == "|" else "kanto",
            }
        )
    return rows


def main() -> None:
    kanto = parse_kanto(KANTO)
    rows = load_csv_rows(CSV_IN)
    out_lines = ["number|name_jp|name_en|region|mean|speech"]

    for row in rows:
        num_str = row["number"].lstrip("#")
        num = int(num_str)
        entry = kanto.get(num)
        if not entry or not entry.get("den"):
            raise SystemExit(f"Missing kanto entry for #{num:03d}")

        romaji = entry.get("romaji") or row["name_jp"].split(" - ")[0].strip()
        mean = build_mean(romaji, entry["den"], entry.get("bong"))
        mean = re.sub(r"\s*\([A-Za-z][^)]*\)", "", mean)
        mean = mean.replace("|", " ").replace("\n", " ")
        speech = mean_to_speech(mean)
        out_lines.append(
            "|".join(
                [
                    row["number"],
                    row["name_jp"],
                    row["name_en"],
                    row.get("region", "kanto"),
                    mean,
                    speech,
                ]
            )
        )

    CSV_OUT.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(rows)} rows to {CSV_OUT}")


if __name__ == "__main__":
    main()
