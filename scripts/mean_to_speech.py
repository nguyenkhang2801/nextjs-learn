"""Convert mean narration to TTS-friendly Vietnamese phonetics (pokemon-name-speech skill)."""
import re

SEP = " "
Z_ONSET = "d"  # za/zu/ze/zo -> da/du/dê/dô (đổi "gi" nếu TTS đọc lệch)

VIET_CHARS = re.compile(
    r"[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹđ]", re.I
)
CJK = r"\u3040-\u30ff\u3400-\u9fff\uff00-\uffef"

# Từ viết hoa KHÔNG được đổi (tiếng Anh / tiếng Việt không dấu vô tình trùng romaji)
KEEP_WORDS = {
    "Salamander", "Caterpillar", "Randsel", "Patapata", "Furu", "Lizard", "Rat", "Boa", "Cobra",
    "Hoa", "Vua", "Mua", "Tai", "Bao", "Dao", "Cao", "Mao", "Kim", "Ban", "Sau", "Meo", "Sao",
    "Mai", "Sai", "Phai", "Miu"
}

# Từ tiếng Anh -> cách đọc tiếng Việt (key viết thường)
ENGLISH_READ = {
    "dig": "đích",
    "dug": "đắc",
    "namco": "nam cô",
    "concept": "con xếp",
    "duck": "đức",
    "game": "ghêm",
    "rare": "re",
    "mine": "Mai",
    "pierre": "bi ê",
    "simon": "Sai mờn",
    "laplace": "lạp lạc",
    "fire": "Phai ơ",
    "mutant": "Miu tần"
}

# Sửa lỗi gõ trong dữ liệu nguồn: từ sai -> romaji đúng
ALIASES = {"sawamular": "sawamuraa", "ebiwalar": "ebiwaraa", "kapoerer": "kapoeraa", "digda": "diguda"}

# Ký hiệu -> cách đọc tiếng Việt
SYMBOL_READ = {
    "+": "và",
    "=": "bằng",
    "&": "và",
    "%": "phần trăm",
    "➜": "thành",
    "→": "thành",
    "×": "nhân",
}

_ONSET = r"(?:ky|gy|ny|hy|my|ry|by|py|sh|ch|ts|[kgsztdnhbpmyrwfj])"
_MORA = re.compile(rf"{_ONSET}?[aeiou]")
_PARSE = re.compile(rf"^({_ONSET}?)([aeiou])(.*)$")
_VOWEL = {"e": "ê", "o": "ô"}
_CODA = {"k": "c"}


def _normalize(w: str) -> str:
    w = w.lower()
    for v in "aiueo":
        w = re.sub(f"{v}{v}+", v, w)  # nguyên âm dài -> đơn
    w = w.replace("ou", "o").replace("ei", "e").replace("tch", "cch")
    return w


def _tokenize(w: str) -> list[str] | None:
    """Tách romaji thành các mora. Trả về None nếu không phải romaji hợp lệ."""
    toks: list[str] = []
    i = 0
    while i < len(w):
        c = w[i]
        if i + 1 < len(w) and w[i] == w[i + 1] and c not in "aeioun":  # kappa -> kap + pa
            if not toks:
                return None
            toks[-1] += c
            i += 1
            continue
        m = _MORA.match(w, i)
        if m:
            toks.append(m.group())
            i = m.end()
            continue
        if c == "n" and toks:  # n cuối âm tiết: dính vào âm trước
            toks[-1] += "n"
            i += 1
            continue
        return None
    return toks or None


def _onset(on: str, v: str) -> str:
    soft = v in "ie"
    if on == "k":
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


def _map_mora(s: str) -> str:
    m = _PARSE.match(s)
    if not m:
        return s
    on, v, coda = m.groups()
    if on == "w":
        out = "oa" if v == "a" else "ô" if v == "o" else "u" + _VOWEL.get(v, v)
    elif len(on) == 2 and on[1] == "y" and on not in ("sh", "ch"):  # kya -> kia
        out = _onset(on[0], "i") + "i" + _VOWEL.get(v, v)
    else:
        out = _onset(on, v) + _VOWEL.get(v, v) if on else _VOWEL.get(v, v)
        if on == "j" and v == "i":
            out = "gi"
    return out + "".join(_CODA.get(ch, ch) for ch in coda)


def romaji_to_speech(word: str) -> str | None:
    w = _normalize(ALIASES.get(word.lower(), word))
    toks = _tokenize(w)
    if toks is None:
        return None
    return SEP.join(_map_mora(t) for t in toks)


def hyphen_name_to_speech(fragment: str) -> str:
    """'Sa-wa-mu-ra-a' -> 'Sa oa mu ra'. Bỏ âm tiết nguyên âm lặp (ra-a)."""
    out: list[str] = []
    prev_raw = ""
    for p in (x for x in fragment.split("-") if x):
        raw = p.lower()
        if raw in "aeiou" and prev_raw and prev_raw[-1] == raw:
            continue
        prev_raw = raw
        if VIET_CHARS.search(raw) or not _MORA.fullmatch(raw):
            out.append(raw)
        else:
            out.append(_map_mora(raw))
    spaced = SEP.join(out)
    return spaced[:1].upper() + spaced[1:] if spaced else fragment


def _convert_word(word: str) -> str:
    """Đổi 1 từ nếu là romaji hợp lệ, không thì giữ nguyên."""
    if "-" in word:
        return hyphen_name_to_speech(word).lower()
    return romaji_to_speech(word) or word

_ENGLISH_RE = re.compile(
    r"(?<!\w)(" + "|".join(map(re.escape, ENGLISH_READ)) + r")(?!\w)", re.I
)

def _apply_english(text: str) -> str:
    def repl(m: re.Match[str]) -> str:
        out = ENGLISH_READ[m.group(1).lower()]
        return out[:1].upper() + out[1:] if m.group(1)[0].isupper() else out

    return _ENGLISH_RE.sub(repl, text)

def _normalize_symbols(text: str) -> str:
    for sym, spoken in SYMBOL_READ.items():
        text = text.replace(sym, f" {spoken} ")
    return text

def _process_quotes(text: str) -> str:
    def repl(m: re.Match[str]) -> str:
        inner = m.group(1)
        if VIET_CHARS.search(inner) or not re.fullmatch(r"[A-Za-z][A-Za-z\-' ]*", inner):
            return inner  # chỉ bỏ ngoặc kép
        return " ".join(_convert_word(w) for w in inner.split())

    return re.sub(r'"([^"]+)"', repl, text)


def _convert_embedded_latin_names(text: str) -> str:
    def repl(m: re.Match[str]) -> str:
        word = m.group(0)
        if word in KEEP_WORDS:
            return word
        return romaji_to_speech(word) or word  # không phải romaji -> giữ nguyên

    return re.sub(r"(?<!\w)[A-Z][a-z]{2,}(?!\w)", repl, text)


def _strip_cjk(text: str) -> str:
    text = re.sub(rf"\s*[(（][^)）]*[{CJK}][^)）]*[)）]", "", text)  # (沢村忠)
    return re.sub(rf"[{CJK}]+", "", text)


def mean_to_speech(mean: str) -> str:
    s = _strip_cjk(mean.strip())
    s = _normalize_symbols(s)
    lead, rest, had_comma = "", s, False

    m = re.match(r"^([A-Za-zĐđ]+(?:-[A-Za-zĐđ]+)+),\s*(.*)$", s)
    if m:
        lead, rest, had_comma = hyphen_name_to_speech(m.group(1)), m.group(2), True
    else:
        m2 = re.match(r"^([A-Za-zĐđ]+(?:-[A-Za-zĐđ]+)+)\s+(.*)$", s)
        if m2:
            lead, rest = hyphen_name_to_speech(m2.group(1)), m2.group(2)

    rest = _apply_english(rest)
    rest = _process_quotes(rest)
    rest = _convert_embedded_latin_names(rest)

    s = (f"{lead}, {rest}" if had_comma else f"{lead} {rest}") if lead else rest
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\s+([,.?!;:])", r"\1", s)
    return s.strip()
