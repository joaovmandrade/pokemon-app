import React, { useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFavoritesStore, Pokemon } from "../store/useFavoritesStore"
import {
  getTypeColor,
  capitalize,
  formatPokemonId,
} from "../utils/pokemonHelpers"

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavoritesStore()

  const handleRemove = useCallback(
    (pokemon: Pokemon) => {
      Alert.alert(
        "Remover favorito",
        `Deseja remover ${capitalize(pokemon.name)} dos favoritos?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            style: "destructive",
            onPress: () => removeFavorite(pokemon.id),
          },
        ],
      )
    },
    [removeFavorite],
  )

  const renderItem = useCallback(
    ({ item }: { item: Pokemon }) => {
      const primaryType = item.types[0] || "normal"
      const color = getTypeColor(primaryType)

      return (
        <View style={[styles.card, { borderLeftColor: color }]}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.info}>
            <Text style={styles.idText}>{formatPokemonId(item.id)}</Text>
            <Text style={styles.name}>{capitalize(item.name)}</Text>
            <View style={styles.typesRow}>
              {item.types.map((type) => (
                <View
                  key={type}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getTypeColor(type) },
                  ]}
                >
                  <Text style={styles.typeText}>{capitalize(type)}</Text>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemove(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="heart-dislike" size={22} color="#FF4D6D" />
          </TouchableOpacity>
        </View>
      )
    },
    [handleRemove],
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />

      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>{favorites.length} Pokémons</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="heart-outline"
            size={64}
            color="rgba(255,255,255,0.15)"
          />
          <Text style={styles.emptyTitle}>Sem favoritos ainda</Text>
          <Text style={styles.emptyText}>
            Toque no ❤️ em qualquer Pokémon da lista para adicioná-lo aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderLeftWidth: 4,
  },
  image: {
    width: 72,
    height: 72,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  idText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  typesRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  removeBtn: {
    padding: 8,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
})