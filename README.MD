# 📱 PokemonApp

Aplicativo mobile desenvolvido com React Native + Expo, com o objetivo de consumir a PokeAPI e apresentar funcionalidades como listagem, favoritos e mapa interativo.

---

## 🚀 Tecnologias Utilizadas

* React Native (Expo)
* TypeScript
* React Navigation (em implementação)
* Zustand (gerenciamento de estado)
* AsyncStorage (persistência local)
* React Native Maps
* Expo Location
* Expo Vector Icons

---

## 🧱 Estrutura do Projeto

O projeto foi organizado visando escalabilidade e separação de responsabilidades:

```
src/
  components/   # Componentes reutilizáveis
  hooks/        # Hooks customizados
  screens/      # Telas principais do app
  services/     # Integração com APIs
  store/        # Estado global (Zustand)
```

---

## ⚙️ Configurações Iniciais

* Projeto iniciado com **Expo + TypeScript**
* Configuração de permissões de localização no `app.json`
* Remoção do `expo-router` para utilização de navegação manual
* Definição de orientação em modo retrato

---

## 📦 Dependências Instaladas

* `react-native-maps` → exibição de mapa
* `expo-location` → acesso à localização do usuário
* `@react-native-async-storage/async-storage` → persistência local
* `zustand` → gerenciamento de estado
* `@expo/vector-icons` → ícones

---

## 🎯 Objetivo do Projeto

O app terá três abas principais:

* 📋 Lista de Pokémons
* 🗺️ Mapa com localização e pins
* ⭐ Favoritos com persistência local

---

## 🧠 Decisões Técnicas

* Uso de **TypeScript** para maior segurança e previsibilidade
* Estrutura modular para facilitar manutenção e crescimento
* Escolha do **Zustand** por ser leve e simples para estado global
* Uso de **AsyncStorage** para persistência offline dos favoritos

---

## ⚠️ Status do Projeto

🚧 Em desenvolvimento

Funcionalidades serão implementadas nas próximas etapas.

---

## ▶️ Como Rodar o Projeto

```bash
npm install
npx expo start
```

---

## 📌 Próximos Passos

* [ ] Implementar navegação por abas
* [ ] Desenvolver listagem de Pokémons
* [ ] Implementar favoritos com persistência
* [ ] Criar tela de mapa com localização
* [ ] Adicionar filtros e busca

---

## 📄 Observações

Este projeto está sendo desenvolvido com foco em:

* Código limpo
* Boas práticas
* Organização
* Evolução incremental

---

## 👨‍💻 Autor

João Vitor Andrade