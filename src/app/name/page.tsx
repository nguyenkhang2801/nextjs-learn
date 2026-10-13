import type { Metadata } from 'next';
import PokemonNamePageContent from '@/modules/PokemonName';
import { loadPokemon } from '@/modules/PokemonName/constants';

export const metadata: Metadata = {
  title: 'Danh sách',
};

export default async function Name() {
  const pokemon = await loadPokemon();

  return <PokemonNamePageContent pokemon={pokemon} />;
}
