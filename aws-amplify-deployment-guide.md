# Guia de Implantação: Next.js + Supabase no AWS Amplify com Domínio GoDaddy

Este guia fornece instruções passo a passo para implantar sua aplicação Next.js com Supabase no AWS Amplify e configurar seu domínio GoDaddy (luizvincenzi.com).

## 1. Preparação do Projeto Next.js para Produção

### 1.1 Configurar Variáveis de Ambiente

Crie um arquivo `.env.production.local` na raiz do projeto (este arquivo não será commitado no Git):

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### 1.2 Verificar Configurações do Next.js

Certifique-se de que seu arquivo `next.config.js` está configurado corretamente para produção:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['seu-projeto.supabase.co'], // Se estiver usando imagens do Supabase Storage
  },
  // Adicione outras configurações específicas de produção aqui
};

module.exports = nextConfig;
```

### 1.3 Testar o Build Localmente

Execute o build localmente para garantir que tudo está funcionando:

```bash
npm run build
```

## 2. Configuração do AWS Amplify

### 2.1 Criar uma Conta AWS

1. Acesse [aws.amazon.com](https://aws.amazon.com)
2. Clique em "Criar uma conta AWS"
3. Siga as instruções para criar uma conta (será necessário fornecer informações de cartão de crédito)
4. Faça login no Console AWS após a criação da conta

### 2.2 Configurar o AWS Amplify

1. No Console AWS, pesquise por "Amplify" e selecione o serviço
2. Clique em "Criar app" ou "New app" > "Host web app"
3. Escolha seu provedor de repositório Git (GitHub, GitLab, Bitbucket, etc.)
4. Autorize o AWS Amplify a acessar seu repositório
5. Selecione o repositório e o branch que deseja implantar (geralmente `main` ou `master`)

### 2.3 Configurar o Build do Next.js no Amplify

Na tela de configuração do build, você pode usar as configurações padrão para Next.js ou personalizar o arquivo `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 2.4 Configurar Variáveis de Ambiente no Amplify

1. No console do Amplify, vá para a aba "Environment variables"
2. Adicione as seguintes variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Quaisquer outras variáveis de ambiente necessárias para sua aplicação

### 2.5 Iniciar o Deploy

Clique em "Save and deploy" para iniciar o processo de build e deploy. O Amplify irá clonar seu repositório, executar o build e implantar a aplicação.

## 3. Integração com Supabase

### 3.1 Configurar o Projeto Supabase para Produção

1. Acesse o [Dashboard do Supabase](https://app.supabase.io)
2. Selecione seu projeto
3. Vá para "Authentication" > "URL Configuration"
4. Adicione o domínio do Amplify (ex: `https://main.d1abc123.amplifyapp.com`) à lista de URLs permitidos
5. Adicione também seu domínio personalizado (`https://luizvincenzi.com` e `https://www.luizvincenzi.com`)

### 3.2 Revisar Configurações de Segurança

1. Verifique as políticas RLS (Row Level Security) para suas tabelas
2. Certifique-se de que as funções e gatilhos estão configurados corretamente
3. Revise as configurações de autenticação e autorização

## 4. Configuração do Domínio GoDaddy

### 4.1 Obter o Domínio de Aplicação do Amplify

Após o deploy inicial, o Amplify fornecerá um URL para sua aplicação (algo como `https://main.d1abc123.amplifyapp.com`). Anote este URL.

### 4.2 Configurar Domínio Personalizado no Amplify

1. No console do Amplify, vá para "Domain management"
2. Clique em "Add domain"
3. Digite seu domínio: `luizvincenzi.com`
4. Clique em "Configure domain"
5. Adicione os subdomínios:
   - Domínio raiz: `luizvincenzi.com`
   - Subdomínio: `www.luizvincenzi.com`
6. Clique em "Save"

O Amplify fornecerá instruções de configuração DNS específicas para seu domínio. Anote os registros DNS que você precisará configurar no GoDaddy.

### 4.3 Configurar DNS no GoDaddy

1. Acesse [godaddy.com](https://www.godaddy.com) e faça login
2. Vá para "Meus Produtos" > "Domínios"
3. Selecione `luizvincenzi.com`
4. Clique em "DNS" ou "Gerenciar DNS"
5. Configure os registros conforme as instruções do Amplify:

   Para o subdomínio www:
   - Tipo: CNAME
   - Nome: www
   - Valor: URL do Amplify (ex: `main.d1abc123.amplifyapp.com`)
   - TTL: 1 hora

   Para o domínio raiz (apex domain), você precisará usar os registros A fornecidos pelo Amplify:
   - Tipo: A
   - Nome: @
   - Valor: Endereços IP fornecidos pelo Amplify
   - TTL: 1 hora

6. Salve as alterações

### 4.4 Verificar Configuração de DNS

A propagação de DNS pode levar até 48 horas, mas geralmente é mais rápida. Você pode verificar o status da propagação usando ferramentas como [dnschecker.org](https://dnschecker.org).

## 5. Teste e Monitoramento

### 5.1 Testar a Aplicação

Após a configuração do domínio e a propagação do DNS, teste sua aplicação acessando:
- `https://luizvincenzi.com`
- `https://www.luizvincenzi.com`

Verifique se:
- A aplicação carrega corretamente
- A integração com Supabase funciona (login, dados, etc.)
- HTTPS está funcionando corretamente

### 5.2 Configurar Monitoramento Básico

1. No console do Amplify, vá para a aba "Monitoring"
2. Verifique os logs de build e deploy
3. Configure notificações para falhas de build ou deploy:
   - Vá para "General" > "Notifications"
   - Adicione um email para receber alertas

## 6. Manutenção e Atualizações

### 6.1 Fluxo de Trabalho de Desenvolvimento

Com o Amplify configurado, seu fluxo de trabalho de desenvolvimento será:
1. Desenvolver localmente
2. Commit e push para o repositório Git
3. O Amplify detectará as mudanças e iniciará automaticamente um novo build e deploy

### 6.2 Monitorar Custos

Monitore regularmente seus custos no AWS Billing Dashboard para evitar surpresas:
1. No Console AWS, vá para "Billing"
2. Verifique o uso e custos do Amplify e outros serviços

## 7. Solução de Problemas Comuns

### 7.1 Falhas de Build

Se o build falhar no Amplify:
1. Verifique os logs de build no console do Amplify
2. Certifique-se de que o build funciona localmente
3. Verifique se todas as variáveis de ambiente necessárias estão configuradas

### 7.2 Problemas de DNS

Se o domínio não estiver funcionando:
1. Verifique se os registros DNS estão configurados corretamente no GoDaddy
2. Verifique o status da verificação de domínio no Amplify
3. Use ferramentas como [dnschecker.org](https://dnschecker.org) para verificar a propagação do DNS

### 7.3 Problemas com Supabase

Se a integração com Supabase não estiver funcionando:
1. Verifique se as variáveis de ambiente do Supabase estão configuradas corretamente
2. Certifique-se de que seu domínio está na lista de URLs permitidos no Supabase
3. Verifique os logs do cliente para erros de conexão

## Recursos Adicionais

- [Documentação do AWS Amplify](https://docs.aws.amazon.com/amplify/)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.io/docs)
- [Gerenciamento de DNS do GoDaddy](https://br.godaddy.com/help/gerenciar-registros-dns-680)
