import React, { memo } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { PokemonDetail } from "../services/pokeApi"
import {
  getTypeColor,
  capitalize,
  formatPokemonId,
} from "../utils/pokemonHelpers"

const { width } = Dimensions.get("window")
const CARD_WIDTH = (width - 48) / 2

type Props = {
  pokemon: PokemonDetail
  isFavorite: boolean
  onToggleFavorite: (pokemon: PokemonDetail) => void
}

function PokemonCard({ pokemon, isFavorite, onToggleFavorite }: Props) {
  const primaryType = pokemon.types[0] || "normal"
  const bgColor = getTypeColor(primaryType)

  return (
    <View style={[styles.card, { backgroundColor: bgColor + "33" }]}>
      <View style={[styles.typeBar, { backgroundColor: bgColor }]} />
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => onToggleFavorite(pokemon)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? "#FF4D6D" : "#888"}
        />
      </TouchableOpacity>

      <Text style={styles.idText}>{formatPokemonId(pokemon.id)}</Text>

      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.info}>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        <View style={styles.typesRow}>
          {pokemon.types.map((type) => (
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
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  typeBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  idText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
    letterSpacing: 1,
  },
  image: {
    width: "100%",
    height: 100,
    marginVertical: 8,
  },
  info: {
    gap: 6,
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  typesRow: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
})

export default memo(PokemonCard)
