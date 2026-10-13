import Image from 'next/image';
import { MeanPlayButton } from '@/modules/PokemonName/MeanPlayButton';

export type PokemonRow = {
  number: string;
  nameJp: string;
  nameEn: string;
  region: string;
  mean: string;
  speech: string;
  url: string;
};

type PokemonCardProps = {
  row: PokemonRow;
};

export function PokemonCard({ row }: PokemonCardProps) {
  return (
    <article className='flex gap-3 rounded-lg border border-foreground/10 bg-background p-3 sm:gap-4 sm:p-4'>
      <div className='shrink-0'>
        <Image
          src={row.url}
          alt={row.nameJp}
          width={80}
          height={80}
          className='aspect-square w-16 max-w-full object-contain bg-white sm:w-20'
        />
      </div>
      <div className='flex min-w-0 flex-1 flex-col gap-2'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0 text-wrap'>
            <p className='text-xs font-medium text-foreground/60'>
              #{row.number} · {row.region}
            </p>
            <h2 className='text-base font-semibold'>{row.nameJp}</h2>
            <p className='text-sm text-foreground/80'>{row.nameEn}</p>
          </div>
          <MeanPlayButton text={row.speech} label={row.nameEn} />
        </div>
        <p className='text-sm leading-relaxed text-foreground/90 whitespace-normal'>
          {row.mean}
        </p>
      </div>
    </article>
  );
}
