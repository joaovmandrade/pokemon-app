import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type Pokemon = {
  id: number
  name: string
  url: string
  imageUrl: string
  types: string[]
}

type FavoritesStore = {
  favorites: Pokemon[]
  loadFavorites: () => Promise<void>
  addFavorite: (pokemon: Pokemon) => Promise<void>
  removeFavorite: (id: number) => Promise<void>
  isFavorite: (id: number) => boolean
}

const STORAGE_KEY = "@pokemon_favorites"

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        set({ favorites: JSON.parse(stored) })
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error)
    }
  },

  addFavorite: async (pokemon: Pokemon) => {
    const updated = [...get().favorites, pokemon]
    set({ favorites: updated })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error("Erro ao salvar favorito:", error)
    }
  },

  removeFavorite: async (id: number) => {
    const updated = get().favorites.filter((p) => p.id !== id)
    set({ favorites: updated })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error("Erro ao remover favorito:", error)
    }
  },

  isFavorite: (id: number) => {
    return get().favorites.some((p) => p.id === id)
  },
}))