#!/bin/bash
# Script para preparar o deploy do Next.js no AWS Amplify
# Autor: Luiz Vincenzi
# Data: 18/03/2025

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Preparando deploy para AWS Amplify ===${NC}"

# Verificar se o Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git não está instalado. Por favor, instale o Git antes de continuar.${NC}"
    exit 1
fi

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não está instalado. Por favor, instale o Node.js antes de continuar.${NC}"
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm não está instalado. Por favor, instale o npm antes de continuar.${NC}"
    exit 1
fi

# Verificar se estamos na raiz do projeto Next.js
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
    echo -e "${RED}Este script deve ser executado na raiz do projeto Next.js.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Ambiente básico verificado${NC}"

# Verificar se há alterações não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}AVISO: Existem alterações não commitadas no repositório.${NC}"
    echo -e "${YELLOW}Recomendamos fazer commit de todas as alterações antes de prosseguir.${NC}"
    
    read -p "Deseja continuar mesmo assim? (s/n): " choice
    if [ "$choice" != "s" ] && [ "$choice" != "S" ]; then
        echo "Operação cancelada pelo usuário."
        exit 0
    fi
fi

# Verificar variáveis de ambiente do Supabase
echo -e "${YELLOW}Verificando variáveis de ambiente do Supabase...${NC}"

if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo -e "${RED}Arquivo .env.local ou .env não encontrado.${NC}"
    echo -e "${YELLOW}Criando arquivo .env.production.local para deploy...${NC}"
    
    read -p "Digite a URL do Supabase (ex: https://seu-projeto.supabase.co): " supabase_url
    read -p "Digite a chave anônima do Supabase: " supabase_anon_key
    
    echo "NEXT_PUBLIC_SUPABASE_URL=$supabase_url" > .env.production.local
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_anon_key" >> .env.production.local
    
    echo -e "${GREEN}✓ Arquivo .env.production.local criado com sucesso${NC}"
else
    echo -e "${GREEN}✓ Arquivo de ambiente encontrado${NC}"
    
    # Verificar se já existe .env.production.local
    if [ ! -f ".env.production.local" ]; then
        echo -e "${YELLOW}Criando .env.production.local baseado no arquivo .env.local existente...${NC}"
        
        if [ -f ".env.local" ]; then
            cp .env.local .env.production.local
        else
            cp .env .env.production.local
        fi
        
        echo -e "${GREEN}✓ Arquivo .env.production.local criado com sucesso${NC}"
    else
        echo -e "${GREEN}✓ Arquivo .env.production.local já existe${NC}"
    fi
fi

# Instalar dependências
echo -e "${YELLOW}Instalando dependências...${NC}"
npm ci

if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao instalar dependências. Verifique os erros acima.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependências instaladas com sucesso${NC}"

# Executar build
echo -e "${YELLOW}Executando build...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao executar o build. Verifique os erros acima.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build executado com sucesso${NC}"

# Criar arquivo amplify.yml se não existir
if [ ! -f "amplify.yml" ]; then
    echo -e "${YELLOW}Criando arquivo amplify.yml para configuração do AWS Amplify...${NC}"
    
    cat > amplify.yml << EOL
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
EOL
    
    echo -e "${GREEN}✓ Arquivo amplify.yml criado com sucesso${NC}"
else
    echo -e "${GREEN}✓ Arquivo amplify.yml já existe${NC}"
fi

echo -e "${GREEN}=== Preparação concluída com sucesso! ===${NC}"
echo -e "${YELLOW}Próximos passos:${NC}"
echo -e "1. Crie uma conta na AWS se ainda não tiver: https://aws.amazon.com"
echo -e "2. Acesse o console do AWS Amplify"
echo -e "3. Clique em 'Criar app' > 'Host web app'"
echo -e "4. Conecte seu repositório Git"
echo -e "5. Configure as variáveis de ambiente no console do Amplify"
echo -e "6. Inicie o deploy"
echo -e "7. Configure seu domínio luizvincenzi.com no GoDaddy conforme o guia"
echo -e "\nConsulte o arquivo aws-amplify-deployment-guide.md para instruções detalhadas."
