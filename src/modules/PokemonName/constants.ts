import { readFile } from 'fs/promises';
import path from 'path';
import type { PokemonRow } from '@/modules/PokemonName/PokemonCard';

export function parsePokemonCsv(content: string): PokemonRow[] {
  return content
    .trim()
    .split('\n')
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|');
      const [number, nameJp, nameEn, region = 'kanto', mean = '', speech = ''] =
        parts.length >= 6 ? parts : [...parts.slice(0, 5), ''];
      return {
        number,
        nameJp,
        nameEn,
        region,
        mean,
        speech: speech || mean,
        url: `https://img.pokemondb.net/artwork/avif/${nameEn}.avif`,
      };
    });
}

export async function loadPokemon(): Promise<PokemonRow[]> {
  const filePath = path.join(process.cwd(), 'src/assets/name/pokemon.csv');
  const content = await readFile(filePath, 'utf-8');
  return parsePokemonCsv(content);
}
