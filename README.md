# CriaCore - Plataforma de Marketing com Influenciadores

Uma plataforma SaaS em português que conecta marcas (especialmente restaurantes locais e PMEs) com criadores de conteúdo para campanhas de marketing baseadas em desempenho. A plataforma permite que empresas criem competições para influenciadores, rastreia o desempenho em tempo real através de hashtags nas redes sociais, e possui um sistema único de rastreamento de cupons para medir conversões diretas.

Teste again agora no new features outra branch !!!!

## Funcionalidades Principais

- **Sistema de Autenticação e Usuários**: Registro e login para marcas, criadores de conteúdo e administradores, com integração social via Google, Facebook/Instagram e Twitter.
- **Sistema de Campanhas e Competições**: Permite que empresas criem e gerenciem campanhas para influenciadores, com regras configuráveis e dashboard de acompanhamento em tempo real.
- **Sistema de Rastreamento e Analytics**: Monitora o desempenho dos influenciadores através de integração com APIs de redes sociais e rastreamento de hashtags.
- **Sistema de Rastreamento de Cupons**: Geração de cupons únicos por influenciador e API para validação de cupons no ponto de venda.
- **Sistema de Pagamentos e Financeiro**: Integração com gateways de pagamento brasileiros e sistema de cálculo automático de premiações por desempenho.
- **Sistema de Automação de Comunicação**: Motor de regras para disparos automáticos baseados em eventos e templates personalizáveis para emails e notificações.
- **Dashboard Administrativo**: Painel administrativo completo para gestão da plataforma, exclusivo para staff interno.

## Tecnologias Utilizadas

### Frontend
- **Framework**: Next.js com TypeScript
- **Estilização**: TailwindCSS
- **Gerenciamento de Estado**: Zustand
- **Autenticação**: Supabase Auth

### Backend
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth com JWT
- **Armazenamento**: Supabase Storage
- **Funções Serverless**: Supabase Edge Functions
- **Realtime**: Supabase Realtime

## Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- Conta no Supabase

## Configuração do Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/criacore.git
cd criacore
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

### 4. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrações SQL localizadas em `supabase/migrations/`
3. Configure a autenticação social (Google, Facebook, Twitter) no painel do Supabase

### 5. Execute o projeto em desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## Deployment

O projeto está configurado para ser implantado no GitHub Pages usando o domínio personalizado www.luizvincenzi.com.

### Configuração de Deployment

1. Certifique-se de que o arquivo CNAME contém o domínio correto:
   ```
   www.luizvincenzi.com
   ```

2. Configure os secrets no GitHub para as variáveis de ambiente do Supabase:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

### Deployment Manual

Para fazer o deployment manualmente, execute:

```bash
npm run build
npm run deploy
```

### Deployment Automático

O projeto está configurado com GitHub Actions para fazer o deployment automático quando houver um push para a branch main. O workflow está definido em `.github/workflows/deploy.yml`.

Para iniciar um deployment manualmente, vá para a aba "Actions" no repositório GitHub e execute o workflow "Deploy to GitHub Pages".

### Configuração de DNS

Para que o domínio personalizado funcione corretamente, configure os seguintes registros DNS:

1. Registro A para `luizvincenzi.com` apontando para os IPs do GitHub Pages:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

2. Registro CNAME para `www.luizvincenzi.com` apontando para `<seu-usuario>.github.io`.

## Estrutura do Projeto

```
criacore/
├── frontend/                      # Aplicação Next.js
│   ├── public/                    # Arquivos estáticos
│   ├── src/
│   │   ├── app/                   # Rotas Next.js App Router
│   │   │   ├── (auth)/            # Rotas de autenticação
│   │   │   ├── (dashboard)/       # Dashboard principal
│   │   │   │   ├── brand/         # Área da marca
│   │   │   │   ├── creator/       # Área do criador
│   │   │   │   └── admin/         # Área administrativa
│   │   │   └── api/               # Rotas de API
│   │   ├── components/            # Componentes React
│   │   ├── hooks/                 # Custom hooks
│   │   ├── lib/                   # Utilitários e configurações
│   │   │   └── supabase/          # Cliente Supabase
│   │   ├── store/                 # Estado global (Zustand)
│   │   └── types/                 # Definições de tipos
│
├── supabase/                      # Configurações do Supabase
│   ├── migrations/                # Migrações SQL
│   └── functions/                 # Edge Functions
│
└── docs/                          # Documentação
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
teste

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
