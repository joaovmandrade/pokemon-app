import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import PokemonListScreen from '../screens/PokemonListScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Pokemons" component={PokemonListScreen} />
        <Tab.Screen name="Mapa" component={MapScreen} />
        <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}