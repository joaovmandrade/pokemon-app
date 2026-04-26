import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import PokemonListScreen from "../screens/PokemonListScreen"
import MapScreen from "../screens/MapScreen"
import FavoritesScreen from "../screens/FavoritesScreen"
import { useFavoritesStore } from "../store/useFavoritesStore"

const Tab = createBottomTabNavigator()

export default function AppNavigator() {
  const { favorites } = useFavoritesStore()

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#13132A",
            borderTopColor: "rgba(255,255,255,0.06)",
            borderTopWidth: 1,
            height: 64,
            paddingBottom: 10,
          },
          tabBarActiveTintColor: "#FF4D6D",
          tabBarInactiveTintColor: "rgba(255,255,255,0.35)",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        <Tab.Screen
          name="Pokémons"
          component={PokemonListScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Mapa"
          component={MapScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Favoritos"
          component={FavoritesScreen}
          options={{
            tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
            tabBarBadgeStyle: {
              backgroundColor: "#FF4D6D",
              color: "#fff",
              fontSize: 10,
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}