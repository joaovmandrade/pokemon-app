import React, { useEffect, useRef, useState, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native"
import MapView, { Marker, Region } from "react-native-maps"
import * as Location from "expo-location"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"

type Pin = {
  id: string
  latitude: number
  longitude: number
  name: string
  pokemonId: number
}

const POKEMON_NAMES = [
  "Pikachu",
  "Charizard",
  "Bulbasaur",
  "Squirtle",
  "Mewtwo",
  "Gengar",
  "Eevee",
  "Snorlax",
  "Articuno",
  "Zapdos",
  "Moltres",
  "Dragonite",
  "Gyarados",
  "Lapras",
  "Ditto",
]

function generateRandomPins(
  latitude: number,
  longitude: number,
  count = 10,
): Pin[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `pin_${i}`,
    latitude: latitude + (Math.random() - 0.5) * 0.08,
    longitude: longitude + (Math.random() - 0.5) * 0.08,
    name: POKEMON_NAMES[i % POKEMON_NAMES.length],
    pokemonId: i + 1,
  }))
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null)
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [pins, setPins] = useState<Pin[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setError(
          "Permissão de localização negada. Ative nas configurações do dispositivo.",
        )
        setLoading(false)
        return
      }
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })
        setLocation(loc)
        const generatedPins = generateRandomPins(
          loc.coords.latitude,
          loc.coords.longitude,
        )
        setPins(generatedPins)
      } catch (e) {
        setError("Não foi possível obter sua localização.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const zoomToRandomPin = useCallback(() => {
    if (pins.length === 0 || !mapRef.current) return
    const randomPin = pins[Math.floor(Math.random() * pins.length)]
    setSelectedPin(randomPin)
    mapRef.current.animateToRegion(
      {
        latitude: randomPin.latitude,
        longitude: randomPin.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      800,
    )
  }, [pins])

  useFocusEffect(
    useCallback(() => {
      if (pins.length > 0) {
        const timer = setTimeout(zoomToRandomPin, 500)
        return () => clearTimeout(timer)
      }
    }, [pins, zoomToRandomPin]),
  )

  const goToMyLocation = () => {
    if (!location || !mapRef.current) return
    mapRef.current.animateToRegion(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF4D6D" />
        <Text style={styles.loadingText}>Obtendo localização...</Text>
      </View>
    )
  }

  if (error || !location) {
    return (
      <View style={styles.centered}>
        <Ionicons name="location-outline" size={48} color="#FF4D6D" />
        <Text style={styles.errorText}>
          {error || "Localização indisponível"}
        </Text>
      </View>
    )
  }

  const initialRegion: Region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={pin.name}
            description={`Pokémon #${String(pin.pokemonId).padStart(3, "0")}`}
            onPress={() => setSelectedPin(pin)}
            pinColor={selectedPin?.id === pin.id ? "#FF4D6D" : "#7B61FF"}
          />
        ))}
      </MapView>

      {/* Header overlay */}
      <SafeAreaView style={styles.headerOverlay} pointerEvents="box-none">
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Mapa Pokémon</Text>
          <Text style={styles.headerSub}>{pins.length} Pokémons próximos</Text>
        </View>
      </SafeAreaView>

      {/* Selected pin info */}
      {selectedPin && (
        <View style={styles.pinInfo}>
          <Text style={styles.pinName}>{selectedPin.name}</Text>
          <Text style={styles.pinId}>
            #{String(selectedPin.pokemonId).padStart(3, "0")}
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={goToMyLocation}>
          <Ionicons name="locate" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.randomBtn]}
          onPress={zoomToRandomPin}
        >
          <Ionicons name="shuffle" size={22} color="#fff" />
          <Text style={styles.randomBtnText}>Pin Aleatório</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d0d1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2b2b3e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0d0d1a" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3a3a5c" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0d2137" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
]

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D1A" },
  map: { flex: 1 },
  centered: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  loadingText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  errorText: {
    color: "#FF4D6D",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerCard: {
    backgroundColor: "rgba(13,13,26,0.85)",
    marginHorizontal: 16,
    marginTop: Platform.OS === "android" ? 40 : 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  headerSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    marginTop: 2,
  },
  pinInfo: {
    position: "absolute",
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: "rgba(13,13,26,0.9)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(123,97,255,0.3)",
  },
  pinName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  pinId: {
    color: "#7B61FF",
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    position: "absolute",
    bottom: 40,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    alignItems: "center",
  },
  actionBtn: {
    backgroundColor: "rgba(13,13,26,0.9)",
    borderRadius: 50,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  randomBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: "#7B61FF",
    borderColor: "transparent",
    gap: 6,
  },
  randomBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
})
