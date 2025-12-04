# Estoque Web

Sistema completo de gerenciamento de estoque desenvolvido com Next.js e Supabase.

## 🚀 Tecnologias Utilizadas

### Frontend
- **[Next.js](https://nextjs.org)** - Framework React com App Router
- **[React 18](https://react.dev)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org)** - Tipagem estática para JavaScript
- **[Material-UI (MUI)](https://mui.com)** - Biblioteca de componentes React
- **[AG Grid Community](https://www.ag-grid.com)** - Tabelas avançadas e performáticas
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado assíncrono e cache
- **[Tailwind CSS](https://tailwindcss.com)** - Framework CSS utilitário
- **[Framer Motion](https://www.framer.com/motion)** - Biblioteca de animações
- **[Lucide React](https://lucide.dev)** - Ícones SVG modernos

### Backend & Infraestrutura
- **[Supabase](https://supabase.com)** - Backend as a Service (PostgreSQL, Auth, Storage)
- **[Supabase SSR](https://supabase.com/docs/guides/auth/server-side)** - Autenticação com cookies
- **[Axios](https://axios-http.com)** - Cliente HTTP para requisições API

### Ferramentas de Desenvolvimento
- **[Prettier](https://prettier.io)** - Formatação de código
- **PostCSS & Autoprefixer** - Processamento CSS
- **pnpm** - Gerenciador de pacotes

## 📋 Funcionalidades

### Sistema de Autenticação
- **Sign In** - Login de usuários
- **Sign Up** - Cadastro de novos usuários
- **Forgot Password** - Recuperação de senha
- **Reset Password** - Redefinição de senha

### Gestão de Itens
- **Listagem de Itens** (`/items`)
  - Filtros por grupo, data de criação, unidade, estado (ativo/inativo) e quantidade (negativo/baixo/normal)
  - Indicadores de alertas (itens negativos e em baixa)
  - Visualização com tooltip para itens desativados
  - Opacidade reduzida para linhas desativadas
- **Detalhes do Item** (`/items/[id]`)
  - Visualização completa de informações
  - Edição de dados do item
  - Histórico de movimentações com filtros
  - Ativação/desativação de itens

### Gestão de Entidades
- **Listagem de Entidades** (`/entities`)
  - Filtro por estado (ativo/inativo)
  - Grid com opacidade para entidades desativadas
- **Detalhes da Entidade** (`/entities/[id]`)
  - Informações de contato completas
  - Edição de dados da entidade
  - Histórico de movimentações com filtros por estado e tipo
  - Ativação/desativação de entidades

### Movimentações
- **Entrada de Itens** (`/input-items`)
  - Registro de entrada de estoque
- **Saída de Itens** (`/output-items`)
  - Registro de saída de estoque
- **Histórico de Movimentações** (`/movement-history`)
  - Filtros por estado (ativo/inativo) e tipo (entrada/saída)
  - Visualização de grupo ID, nota fiscal, data, responsável, entidade e item
  - Ações para ativar/desativar movimentações (individual ou por grupo)
  - Indicadores visuais para itens desativados

### Gestão de Usuários
- **Meus Usuários** (`/my-users`)
  - Listagem de usuários da empresa
  - Filtro por estado (ativo/inativo)
  - Gerenciamento de permissões (Admin/Default)
  - Indicador visual para o usuário atual
  - Ativação/desativação de usuários

### Outras Páginas
- **Design System** (`/design-system`) - Biblioteca de componentes UI
- **Documentação** (`/docs`) - Documentação da API com Swagger
- **Ajuda** (`/help`) - Central de ajuda

## 🎨 Arquitetura do Projeto

### Estrutura de Pastas
```
app/
├── (pages)/              # Páginas da aplicação
│   ├── (auth)/          # Páginas de autenticação
│   ├── items/           # Gestão de itens
│   ├── entities/        # Gestão de entidades
│   ├── movement-history/# Histórico de movimentações
│   └── my-users/        # Gestão de usuários
├── api/                 # API Routes (Next.js)
│   ├── entity/          # Endpoints de entidades
│   ├── item/            # Endpoints de itens
│   ├── movement/        # Endpoints de movimentações
│   └── user/            # Endpoints de usuários
└── theme/               # Configurações de tema (MUI, AG Grid)

components/              # Componentes React reutilizáveis
├── Entity/             # Componentes de entidades
├── Items/              # Componentes de itens
├── MovimentHistory/    # Componentes de histórico
├── Users/              # Componentes de usuários
├── Tables/             # Componentes de tabelas (AG Grid)
└── ui/                 # Componentes de UI genéricos

lib/
├── data-base/          # Camada de acesso ao banco (Supabase)
├── services/           # Camada de serviços (lógica de negócio)
└── models/             # Modelos de dados TypeScript

utils/                  # Utilitários e helpers
```

### Padrão de Arquitetura em Camadas

O projeto segue uma arquitetura em 3 camadas:

1. **Route Layer** (`app/api/`) - Parse de parâmetros e validação de entrada
2. **Service Layer** (`lib/services/`) - Lógica de negócio e transformação de dados
3. **Database Layer** (`lib/data-base/`) - Queries SQL e acesso ao Supabase

**Exemplo de fluxo:**
- Route: Parseia filtros da query string
- Service: Valida e passa filtros para o DB
- Database: Aplica filtros via SQL (`.eq()`, `.gt()`, `.lt()`)

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm/yarn
- Conta no Supabase

### Instalação

1. Clone o repositório
   ```bash
   git clone https://github.com/ALenckulh/Estoque-web.git
   cd Estoque-web/estoque-web
   ```

2. Instale as dependências
   ```bash
   pnpm install
   ```

3. Configure as variáveis de ambiente
   ```bash
   cp .env.example .env.local
   ```
   
   Atualize `.env.local` com suas credenciais do Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=[SUA_URL_DO_SUPABASE]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA_CHAVE_ANON]
   ```

4. Execute o servidor de desenvolvimento
   ```bash
   pnpm dev
   OU
   npm dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL através do Supabase com as seguintes tabelas principais:

- `enterprise` - Empresas
- `users` - Usuários
- `entity` - Entidades (fornecedores/clientes)
- `item` - Itens do estoque
- `movement_history` - Histórico de movimentações
- `group`, `segment`, `unit` - Dados auxiliares

### Soft Delete

Todas as entidades principais utilizam o campo `safe_delete` (boolean) para soft delete, permitindo:
- Manter histórico completo
- Recuperar registros desativados
- Filtrar por estado (ativo/inativo)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
