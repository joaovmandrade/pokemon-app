import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {
  fetchPokemonList,
  fetchPokemonDetail,
  getIdFromUrl,
  PokemonDetail,
} from "../services/pokeApi"
import { useFavoritesStore } from "../store/useFavoritesStore"
import PokemonCard from "../components/PokemonCard"
import { capitalize } from "../utils/pokemonHelpers"

const PAGE_SIZE = 20
const ALL_TYPES = [
  "todos",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "normal",
]

const TYPE_LABEL: Record<string, string> = {
  todos: "Todos",
  fire: "Fogo",
  water: "Água",
  grass: "Planta",
  electric: "Elétrico",
  psychic: "Psíquico",
  ice: "Gelo",
  dragon: "Dragão",
  dark: "Sombrio",
  fairy: "Fada",
  fighting: "Lutador",
  flying: "Voador",
  poison: "Veneno",
  ground: "Terra",
  rock: "Pedra",
  bug: "Inseto",
  ghost: "Fantasma",
  steel: "Aço",
  normal: "Normal",
}

export default function PokemonListScreen() {
  const [allPokemons, setAllPokemons] = useState<PokemonDetail[]>([])
  const [displayed, setDisplayed] = useState<PokemonDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState("todos")
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const { addFavorite, removeFavorite, isFavorite, loadFavorites } =
    useFavoritesStore()

  useEffect(() => {
    loadFavorites()
    loadPokemons(0, true)
  }, [])

  const loadPokemons = async (currentOffset: number, reset = false) => {
    try {
      if (reset) setLoading(true)
      else setLoadingMore(true)
      setError(null)

      const listData = await fetchPokemonList(PAGE_SIZE, currentOffset)
      setTotalCount(listData.count)

      const details = await Promise.all(
        listData.results.map((p) => fetchPokemonDetail(getIdFromUrl(p.url))),
      )

      const newList = reset ? details : [...allPokemons, ...details]
      setAllPokemons(newList)
      setOffset(currentOffset + PAGE_SIZE)
      setHasMore(currentOffset + PAGE_SIZE < listData.count)
    } catch (e: any) {
      setError(e.message || "Erro ao carregar Pokémons")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    let filtered = allPokemons
    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase().trim()),
      )
    }
    if (selectedType !== "todos") {
      filtered = filtered.filter((p) => p.types.includes(selectedType))
    }
    setDisplayed(filtered)
  }, [search, selectedType, allPokemons])

  const handleToggleFavorite = useCallback(
    (pokemon: PokemonDetail) => {
      if (isFavorite(pokemon.id)) {
        removeFavorite(pokemon.id)
      } else {
        addFavorite(pokemon)
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  )

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !search && selectedType === "todos") {
      loadPokemons(offset)
    }
  }

  const renderItem = useCallback(
    ({ item, index }: { item: PokemonDetail; index: number }) => (
      <View style={index % 2 === 0 ? styles.leftItem : styles.rightItem}>
        <PokemonCard
          pokemon={item}
          isFavorite={isFavorite(item.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>
    ),
    [isFavorite, handleToggleFavorite],
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF4D6D" />
        <Text style={styles.loadingText}>Carregando Pokédex...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#FF4D6D" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => loadPokemons(0, true)}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
        <Text style={styles.subtitle}>{totalCount} Pokémons</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Type Filter */}
      <FlatList
        data={ALL_TYPES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={styles.filterRow}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedType === item && styles.filterChipActive,
            ]}
            onPress={() => setSelectedType(item)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedType === item && styles.filterChipTextActive,
              ]}
            >
              {TYPE_LABEL[item] || capitalize(item)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* List */}
      <FlatList
        data={displayed}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhum Pokémon encontrado</Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#FF4D6D"
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  centered: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  // ── FILTROS CORRIGIDOS ──────────────────────────────────────────
  filterRow: {
    flexGrow: 0, // impede que o FlatList horizontal tome altura extra
    flexShrink: 0,
    marginBottom: 10,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    alignItems: "center", // centraliza verticalmente os chips
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    // sem width fixo → o chip cresce conforme o texto
  },
  filterChipActive: {
    backgroundColor: "#FF4D6D",
    borderColor: "#FF4D6D",
  },
  filterChipText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    // sem numberOfLines → sem truncamento
  },
  filterChipTextActive: {
    color: "#fff",
  },
  // ────────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  leftItem: { flex: 1, marginRight: 8 },
  rightItem: { flex: 1, marginLeft: 8 },
  loadingText: {
    color: "rgba(255,255,255,0.5)",
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: "#FF4D6D",
    textAlign: "center",
    paddingHorizontal: 32,
    fontSize: 14,
  },
  retryBtn: {
    backgroundColor: "#FF4D6D",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  emptyText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 14,
    marginTop: 48,
  },
})
