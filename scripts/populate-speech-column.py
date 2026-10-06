#!/usr/bin/env python3
"""Add or refresh speech column from mean in pokemon.csv."""
from pathlib import Path

from mean_to_speech import mean_to_speech

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "src/assets/name/pokemon.csv"


def main() -> None:
    lines = CSV_PATH.read_text(encoding="utf-8").strip().split("\n")
    header = lines[0]
    if header == "number|name_jp|name_en|region|mean":
        out_header = "number|name_jp|name_en|region|mean|speech"
    elif header == "number|name_jp|name_en|region|mean|speech":
        out_header = header
    else:
        raise SystemExit(f"Unexpected header: {header}")

    out_lines = [out_header]
    for line in lines[1:]:
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) == 5:
            number, name_jp, name_en, region, mean = parts
        elif len(parts) == 6:
            number, name_jp, name_en, region, mean, _old = parts
        else:
            raise SystemExit(f"Bad row ({len(parts)} cols): {line[:80]}")
        speech = mean_to_speech(mean)
        out_lines.append("|".join([number, name_jp, name_en, region, mean, speech]))

    CSV_PATH.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(out_lines) - 1} rows with speech to {CSV_PATH}")


if __name__ == "__main__":
    main()
