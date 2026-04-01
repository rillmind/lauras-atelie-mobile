# Laura's Ateliê Mobile — CLAUDE.md

## Visão Geral do Projeto

App React Native (Expo) para catálogo de peças de crochê do Laura's Ateliê.

### Stack
- **Framework**: Expo SDK 54 com Expo Router 5
- **Linguagem**: TypeScript
- **Package manager**: Bun
- **UI**: React Native + react-native-safe-area-context
- **Ícones**: @expo/vector-icons (Ionicons)

### Estrutura de Arquivos
```
app/                          # Rotas (Expo Router)
  _layout.tsx                 # Root layout com Stack + ProductProvider
  index.tsx                   # Tela principal (catálogo)
  admin/index.tsx             # Tela de cadastro de peças (admin)
  clientes/index.tsx          # Tela de cadastro de clientes
  produto/[id].tsx            # Detalhe do produto
src/
  api/
    client.ts                 # Funções de API (atualmente mock)
    config.ts                 # API_BASE_URL
  components/
    BottomNav.tsx             # Navegação inferior
    ProductCard.tsx           # Card de produto
    WhatsAppFAB.tsx           # Botão flutuante WhatsApp
  contexts/
    ProductContext.tsx        # Contexto global (produtos + clientes)
  assets/
    logo.png                  # Logo do app
```

## Convenções

### Cores
Definidas localmente em cada componente (sem tema global). Paleta:
- `background`: #F5F0EB | `foreground`: #3D3229
- `card`: #EDE6DF | `primary`: #B8734A
- `muted`: #E0D8CF | `mutedForeground`: #8A7A6E
- `border`: #D5C9BC | `honey`: #D4A050 | `rose`: #D4A0B0

### Fontes
- **Títulos**: PlayfairDisplay (700)
- **Corpo**: Nunito (400/600/700)
- Ambas custom fonts — se usar fontFamily, referenciar por nome.

### SafeAreaView
Usar **sempre** `react-native-safe-area-context`, nunca `react-native`.

### Import aliases
`@/*` mapeado para `./src/*` (definido em tsconfig.json).

### Dados
Atualmente usa **mock local** em `src/api/client.ts`. Sem backend real.

## Erros Cometidos (Não Repetir)

### 1. `localhost` em API para celular
**Erro**: `API_BASE_URL = "http://localhost:3000/api"` — no celular, localhost aponta para o próprio dispositivo, não para o servidor.
**Correção**: Usar IP da rede local (`192.168.1.110`) ou mock.
**Lição**: APIs acessadas de dispositivo móvel nunca devem usar localhost.

### 2. React version mismatch
**Erro**: `"react": "~19.1.0"` com tilde permitiu instalação do 19.1.5, incompatível com react-native-renderer 19.1.0.
**Correção**: `"react": "19.1.0"` (versão exata, sem tilde).
**Lição**: Usar versões exatas para react e react-native em projetos Expo.

### 3. SafeAreaView depreciado
**Erro**: Importando `SafeAreaView` de `react-native` em vez de `react-native-safe-area-context`.
**Correção**: Trocar todos os imports para `react-native-safe-area-context`.
**Lição**: Sempre verificar se componentes do React Native têm alternativas mais modernas no ecossistema Expo.

### 4. Tentar iniciar Expo com porta ocupada
**Erro**: Não verificar se havia processo Expo preso antes de iniciar novo servidor.
**Correção**: Sempre rodar `lsof -ti:8081 | xargs kill -9` antes de `expo start`.
**Lição**: Matar processos na porta 8081 antes de iniciar o dev server.

### 5. Não verificar se backend está rodando
**Erro**: Assumir que API em porta 3000 estaria disponível sem confirmar.
**Correção**: Criar mock local como fallback quando backend não existe.
**Lição**: Sempre confirmar que dependências externas estão ativas antes de testar.

## Manual para Próximas Sessões

### Iniciar o Servidor
```bash
# 1. Matar processos presos na porta 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null

# 2. Iniciar Expo
bunx expo start --clear
```

### Testar no Celular
1. Escanear QR code com app Expo Go
2. Verificar que ambos (computador e celular) estão na **mesma rede Wi-Fi**
3. Se usar API real, confirmar que `API_BASE_URL` usa IP da rede local, não localhost

### Antes de Entregar Alterações
1. Verificar se não há erros no terminal do Expo
2. Confirmar que o bundling completa sem warnings críticos
3. Testar navegação entre todas as telas

### Regras de Negócio
- **Clientes cadastrados só aparecem para admin**: A lista de clientes na tela `/clientes` só é exibida quando `adminUnlocked === true` (após digitar senha correta)
- Senha admin: definida em `ADMIN_PASSWORD` no arquivo `src/screens/clientes/index.tsx`
- Catálogo de produtos é público
- Botão WhatsApp direciona para `5587996787856`

### Adicionar Backend Real (Futuro)
Quando backend estiver disponível:
1. Atualizar `src/api/config.ts` com URL correta
2. Restaurar `src/api/client.ts` para usar `fetch()` com `API_BASE_URL`
3. Remover dados mock
