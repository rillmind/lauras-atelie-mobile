# Laura's Ateliê - Mobile App

Aplicativo React Native para o ateliê de crochê, construído com Expo.

## Instalação

```bash
bun install
```

## Executar

```bash
bun start
```

Depois siga as instruções para abrir no simulador iOS, emulador Android ou dispositivo físico via Expo Go.

## Estrutura

```
app/                    # Rotas (expo-router)
  _layout.tsx          # Layout raiz com providers
  index.tsx            # Tela principal
  produto/[id].tsx     # Detalhes do produto
  admin/index.tsx      # Tela de admin
  clientes/index.tsx   # Tela de clientes
src/
  components/          # Componentes reutilizáveis
  contexts/            # Context API (ProductContext)
  screens/             # Implementações das telas
  assets/              # Imagens e recursos
```
