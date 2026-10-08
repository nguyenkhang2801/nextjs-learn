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
import { MeanPlayButton } from './MeanPlayButton';

type Pokemon = {
  number: string;
  nameJp: string;
  nameEn: string;
  region: string;
  mean: string;
  speech: string;
  url: string;
};

function parsePokemonCsv(content: string): Pokemon[] {
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
            <TableHead>Region</TableHead>
            <TableHead>Mean</TableHead>
            <TableHead className='w-[56px]'>Play</TableHead>
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
                  className='aspect-square object-contain bg-white'
                />
              </TableCell>
              <TableCell>{row.nameJp}</TableCell>
              <TableCell>{row.nameEn}</TableCell>
              <TableCell>{row.region}</TableCell>
              <TableCell className='max-w-md text-sm whitespace-normal'>
                {row.mean}
              </TableCell>
              <TableCell>
                <MeanPlayButton text={row.speech} label={row.nameEn} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
