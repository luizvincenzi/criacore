#!/bin/bash

# Script para testar o deployment localmente antes de enviar para o GitHub Pages

echo "🚀 Iniciando teste de deployment local..."

# Verificar se o arquivo CNAME existe
if [ ! -f "CNAME" ]; then
  echo "❌ Erro: Arquivo CNAME não encontrado!"
  exit 1
else
  echo "✅ Arquivo CNAME encontrado: $(cat CNAME)"
fi

# Verificar se as variáveis de ambiente estão configuradas
if [ ! -f ".env.local" ]; then
  echo "⚠️ Aviso: Arquivo .env.local não encontrado. Certifique-se de configurar as variáveis de ambiente para o deployment."
else
  echo "✅ Arquivo .env.local encontrado."
fi

# Limpar a pasta out se existir
if [ -d "out" ]; then
  echo "🧹 Limpando pasta out existente..."
  rm -rf out
fi

# Executar o build
echo "🔨 Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -ne 0 ]; then
  echo "❌ Erro: Falha no build!"
  exit 1
else
  echo "✅ Build concluído com sucesso!"
fi

# Adicionar arquivo .nojekyll
echo "📄 Adicionando arquivo .nojekyll..."
touch out/.nojekyll

# Copiar arquivo CNAME
echo "📋 Copiando arquivo CNAME para a pasta out..."
cp CNAME out/

# Verificar os arquivos gerados
echo "📂 Arquivos gerados na pasta out:"
ls -la out/

# Verificar se os arquivos necessários foram gerados
if [ ! -d "out" ]; then
  echo "❌ Erro: Pasta out não encontrada!"
else
  echo "✅ Pasta out encontrada."
fi

echo "✨ Teste de deployment concluído! Você pode verificar os arquivos na pasta 'out'."
echo "📝 Para testar localmente, você pode executar: npx serve out"
echo "🚀 Para fazer o deployment para o GitHub Pages, execute: npm run deploy"
