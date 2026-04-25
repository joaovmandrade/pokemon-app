import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { FlatList } from "react-native"

type Pokemon = {
  name: string
  url: string
}

export default function PokemonListScreen() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const BASE_URL = "https://pokeapi.co/api/v2/pokemon"

  useEffect(() => {
    async function fetchPokemonList() {
      try {
        const response = await fetch(`${BASE_URL}?limit=151`)
        const data = await response.json()
        setPokemonList(data.results)
        console.log(data.results)
      } catch (error) {
        console.error("Erro ao buscar lista de Pokémons:", error)
      }
    }

    fetchPokemonList()
  }, [])
  
  // Transformar cada item da lista em um "card" clicável (botão)

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Text
            style={{
              color: "white",
              fontSize: 18,
              marginBottom: 10,
              width: "100%",
            }}
          >
            {item.name}
          </Text>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
});