import { readFile } from 'fs/promises';
import path from 'path';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/component';
import Image from 'next/image';

type Pokemon = {
  number: string;
  nameJp: string;
  nameEn: string;
  url: string;
};

function parsePokemonCsv(content: string): Pokemon[] {
  return content
    .trim()
    .split('\n')
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const firstComma = line.indexOf(',');
      const lastComma = line.lastIndexOf(',');
      return {
        number: line.slice(0, firstComma),
        nameJp: line.slice(firstComma + 1, lastComma),
        nameEn: line.slice(lastComma + 1),
        url: `https://img.pokemondb.net/artwork/avif/${line.slice(
          lastComma + 1,
        )}.avif`,
      };
    });
}

async function loadPokemon(): Promise<Pokemon[]> {
  const filePath = path.join(process.cwd(), 'src/assets/name/pokemon.csv');
  const content = await readFile(filePath, 'utf-8');
  return parsePokemonCsv(content);
}

export default async function Name() {
  const pokemon = await loadPokemon();

  return (
    <div className='p-4 h-full'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Number</TableHead>
            <TableHead className='w-[100px]'>Image</TableHead>
            <TableHead>Name (JP)</TableHead>
            <TableHead>Name (EN)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pokemon.map((row) => (
            <TableRow key={row.number}>
              <TableCell className='font-medium'>{row.number}</TableCell>
              <TableCell>
                <Image
                  src={row.url}
                  alt={row.nameJp}
                  width={100}
                  height={100}
                  className='aspect-square object-contain'
                />
              </TableCell>
              <TableCell>{row.nameJp}</TableCell>
              <TableCell>{row.nameEn}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
