"""Convert mean narration to TTS-friendly Vietnamese phonetics (pokemon-name-speech skill)."""
import re

VIET_CHARS = re.compile(r"[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹđ]", re.I)

DIGRAPHS = (
    "kya",
    "kyu",
    "kyo",
    "gya",
    "gyu",
    "gyo",
    "sha",
    "shu",
    "sho",
    "cha",
    "chu",
    "cho",
    "nya",
    "nyu",
    "nyo",
    "hya",
    "hyu",
    "hyo",
    "mya",
    "myu",
    "myo",
    "rya",
    "ryu",
    "ryo",
    "shi",
    "chi",
    "tsu",
    "thi",
    "ji",
    "fu",
    "fa",
    "fi",
    "fe",
    "fo",
)


def _map_syllable(syl: str) -> str:
    s = syl.lower()
    repl = {
        "shi": "si",
        "chi": "chi",
        "tsu": "xu",
        "thi": "ti",
        "ji": "gi",
        "fu": "phu",
        "fa": "pha",
        "fi": "phi",
        "fe": "phe",
        "fo": "pho",
        "ka": "ca",
        "ki": "ki",
        "ku": "cu",
        "ke": "kê",
        "ko": "cô",
        "ga": "ga",
        "gi": "ghi",
        "gu": "gu",
        "ge": "ghê",
        "go": "gô",
        "sa": "sa",
        "su": "su",
        "se": "sê",
        "so": "sô",
        "za": "za",
        "zu": "zu",
        "ze": "dze",
        "zo": "dô",
        "ta": "ta",
        "te": "tê",
        "to": "tô",
        "da": "đa",
        "de": "đê",
        "di": "đi",
        "do": "đô",
        "du": "đu",
        "na": "na",
        "ni": "ni",
        "nu": "nu",
        "ne": "nê",
        "no": "nô",
        "ha": "ha",
        "hi": "hi",
        "he": "hê",
        "ho": "hô",
        "ba": "ba",
        "bi": "bi",
        "bu": "bu",
        "be": "bê",
        "bo": "bô",
        "pa": "pa",
        "pi": "pi",
        "pu": "pu",
        "pe": "pê",
        "po": "pô",
        "ma": "ma",
        "mi": "mi",
        "mu": "mu",
        "me": "mê",
        "mo": "mô",
        "ya": "gia",
        "yu": "giu",
        "yo": "giô",
        "ra": "ra",
        "ri": "ri",
        "ru": "ru",
        "re": "rê",
        "ro": "rô",
        "wa": "oa",
        "wo": "ô",
        "ja": "gia",
        "ju": "giu",
        "jo": "giô",
        "kya": "kia",
        "kyu": "kiu",
        "kyo": "kiô",
        "sha": "sa",
        "shu": "su",
        "sho": "sô",
        "cha": "cha",
        "chu": "chu",
        "cho": "chô",
    }
    if s in repl:
        return repl[s]
    if len(s) == 1 and s in "aeiou":
        return "ê" if s == "e" else "ô" if s == "o" else s
    return s


def _split_romaji(word: str) -> list[str]:
    w = word.lower().strip()
    if not w:
        return []
    out: list[str] = []
    i = 0
    while i < len(w):
        if i + 1 < len(w) and w[i] == w[i + 1] and w[i] not in "aeiou":
            prev = out[-1] if out else w[i]
            out.append(prev)
            i += 1
            continue
        matched = None
        for d in sorted(DIGRAPHS, key=len, reverse=True):
            if w.startswith(d, i):
                matched = d
                break
        if matched:
            out.append(matched)
            i += len(matched)
            continue
        if i + 1 < len(w) and w[i + 1] in "aeiouy":
            out.append(w[i : i + 2])
            i += 2
        else:
            out.append(w[i])
            i += 1
    return out


def romaji_to_speech(word: str) -> str:
    syllables = [_map_syllable(s) for s in _split_romaji(word)]
    return " ".join(syllables)


def hyphen_name_to_speech(fragment: str) -> str:
    parts = [_map_syllable(p) for p in fragment.split("-") if p]
    spaced = " ".join(parts)
    if not spaced:
        return fragment
    return spaced[0].upper() + spaced[1:]


def _is_latin_token(text: str) -> bool:
    t = text.strip()
    if not t or VIET_CHARS.search(t):
        return False
    return bool(re.fullmatch(r"[A-Za-z][A-Za-z0-9\-']*", t))


def _convert_latin_word(word: str) -> str:
    return romaji_to_speech(word.replace("-", ""))


def _process_quotes(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        inner = match.group(1)
        if _is_latin_token(inner):
            return _convert_latin_word(inner)
        return inner

    return re.sub(r'"([^"]+)"', repl, text)


def _convert_embedded_latin_names(text: str) -> str:
    """Roman names in prose (Hitokage, Zenigame, Arbo, …)."""

    def repl(match: re.Match[str]) -> str:
        word = match.group(0)
        if word in {"Salamander", "Caterpillar", "Randsel", "Patapata", "Furu", "Lizard", "Rat", "Boa", "Cobra"}:
            return word
        return _convert_latin_word(word)

    return re.sub(r"\b[A-Z][a-z]{2,}\b", repl, text)


def mean_to_speech(mean: str) -> str:
    s = mean.strip()
    lead = ""
    rest = s
    had_comma = False

    m = re.match(r"^([A-Za-zĐđ]+(?:-[A-Za-zĐđ]+)+),\s*(.*)$", s)
    if m:
        lead = hyphen_name_to_speech(m.group(1))
        rest = m.group(2)
        had_comma = True
    else:
        m2 = re.match(r"^([A-Za-zĐđ]+(?:-[A-Za-zĐđ]+)+)\s+(.*)$", s)
        if m2:
            lead = hyphen_name_to_speech(m2.group(1))
            rest = m2.group(2)

    rest = _process_quotes(rest)
    rest = _convert_embedded_latin_names(rest)

    if lead:
        s = f"{lead}, {rest}" if had_comma else f"{lead} {rest}"
    else:
        s = rest

    return re.sub(r"\s+", " ", s).strip()
