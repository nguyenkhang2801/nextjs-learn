'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  TextInput,
} from '@/component';
import { POKEMON_REGIONS } from '@/types/region';
import { MeanPlayButton } from '@/modules/PokemonName/MeanPlayButton';
import {
  PokemonCard,
  type PokemonRow,
} from '@/modules/PokemonName/PokemonCard';
import { useDebounce } from '@/hook';

type PokemonNamePageContentProps = {
  pokemon: PokemonRow[];
};

function matchesSearch(row: PokemonRow, query: string) {
  if (!query) {
    return true;
  }
  const haystack = [
    row.nameEn,
    row.nameJp,
    row.number,
    row.nameJp.split(' - ')[0]?.trim() ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

function PokemonNamePageContent({ pokemon }: PokemonNamePageContentProps) {
  const [region, setRegion] = useState('kanto');
  const [search, setSearch] = useState('');

  const onSearchHandler = useDebounce(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      let value = '';
      if (typeof e === 'string') value = e;
      else value = e.target.value.toString().trim().toLowerCase();
      console.log(value);
      setSearch(value);
    },
    400,
  );

  const filtered = useMemo(
    () =>
      pokemon.filter(
        (row) =>
          row.region.toLowerCase() === region && matchesSearch(row, search),
      ),
    [pokemon, region, search],
  );

  return (
    <div className='flex h-full flex-col gap-4 p-4 sm:p-6'>
      <div className='flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <header className='min-w-0'>
          <h1 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Danh sách Pokémon
          </h1>
          <p className='mt-1 text-sm text-foreground/70'>
            {filtered.length} / {pokemon.length} mục
            {filtered.length !== pokemon.length ? ' (đã lọc)' : ''}
            {' · '}
            vuốt bảng ngang trên máy tính bảng nếu cần
          </p>
        </header>

        <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto lg:min-w-[min(100%,28rem)] lg:max-w-xl'>
          <Select
            label='Vùng'
            value={region}
            onChange={setRegion}
            options={POKEMON_REGIONS.map((r) => ({
              value: r.value,
              label: r.label,
            }))}
            className='sm:min-w-[9.5rem] sm:flex-1'
          />
          <TextInput
            label='Tìm theo tên'
            type='search'
            onChange={onSearchHandler}
            placeholder='VD: pikachu, ピカチュウ…'
            containerClassName='sm:flex-[2]'
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className='text-sm text-foreground/70'>
          Không có Pokémon phù hợp. Thử đổi vùng hoặc từ khóa tìm kiếm.
        </p>
      ) : (
        <>
          <div className='flex flex-col gap-3 md:hidden'>
            {filtered.map((row) => (
              <PokemonCard key={row.number} row={row} />
            ))}
          </div>

          <div className='hidden min-h-0 flex-1 md:block'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[72px] md:w-[100px]'>
                    Number
                  </TableHead>
                  <TableHead className='w-[72px] md:w-[100px]'>Image</TableHead>
                  <TableHead>Name (JP)</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Mean</TableHead>
                  <TableHead className='w-[56px]'>Play</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.number}>
                    <TableCell className='font-medium'>{row.number}</TableCell>
                    <TableCell>
                      <Image
                        src={row.url}
                        alt={row.nameJp}
                        width={100}
                        height={100}
                        className='aspect-square w-16 max-w-full object-contain bg-white md:w-[100px]'
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
        </>
      )}
    </div>
  );
}

export default PokemonNamePageContent;
