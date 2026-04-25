// Tela de mapa do aplicativo
// Aqui será implementado:
// - exibição do mapa (react-native-maps)
// - obtenção da localização do usuário
// - criação de pins aleatórios
// - foco automático em um pin ao entrar na tela

import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text>Mapa</Text>
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