const BASE_URL = "https://pokeapi.co/api/v2"

export type PokemonListItem = {
  name: string
  url: string
}

export type PokemonDetail = {
  id: number
  name: string
  url: string
  imageUrl: string
  types: string[]
}

export async function fetchPokemonList(
  limit = 20,
  offset = 0,
): Promise<{ results: PokemonListItem[]; count: number }> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  )
  if (!response.ok) throw new Error("Falha ao buscar lista de Pokémons")
  return response.json()
}

export async function fetchPokemonDetail(
  nameOrId: string | number,
): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
  if (!response.ok) throw new Error(`Falha ao buscar detalhes: ${nameOrId}`)
  const data = await response.json()
  return {
    id: data.id,
    name: data.name,
    url: `${BASE_URL}/pokemon/${data.id}`,
    imageUrl:
      data.sprites?.other?.["official-artwork"]?.front_default ||
      data.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
    types: data.types.map((t: any) => t.type.name),
  }
}

export function getIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/")
  return parseInt(parts[parts.length - 1], 10)
}

export function getImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}