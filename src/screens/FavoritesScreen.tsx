// Tela de favoritos
// Aqui será implementado:
// - listagem dos Pokémons favoritados
// - remoção de favoritos
// - leitura dos dados persistidos (AsyncStorage / Zustand)

import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text>Favoritos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});