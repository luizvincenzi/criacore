#!/bin/bash

# Script para fazer deploy estático para o GitHub Pages

echo "🚀 Iniciando deploy para GitHub Pages..."

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

# Mover temporariamente as pastas de rotas dinâmicas
echo "🔄 Movendo temporariamente as pastas de rotas dinâmicas..."
if [ -d "src/app/dashboard/campaigns/[id]" ]; then
  mv src/app/dashboard/campaigns/[id] src/app/dashboard/campaigns/_id_temp
  echo "  ✓ Movido src/app/dashboard/campaigns/[id]"
fi

# Executar o build
echo "🔨 Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -ne 0 ]; then
  echo "❌ Erro: Falha no build!"
  
  # Restaurar as pastas de rotas dinâmicas
  echo "🔄 Restaurando as pastas de rotas dinâmicas..."
  if [ -d "src/app/dashboard/campaigns/_id_temp" ]; then
    mv src/app/dashboard/campaigns/_id_temp src/app/dashboard/campaigns/[id]
    echo "  ✓ Restaurado src/app/dashboard/campaigns/[id]"
  fi
  
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

# Restaurar as pastas de rotas dinâmicas
echo "🔄 Restaurando as pastas de rotas dinâmicas..."
if [ -d "src/app/dashboard/campaigns/_id_temp" ]; then
  mv src/app/dashboard/campaigns/_id_temp src/app/dashboard/campaigns/[id]
  echo "  ✓ Restaurado src/app/dashboard/campaigns/[id]"
fi

# Verificar os arquivos gerados
echo "📂 Arquivos gerados na pasta out:"
ls -la out/

# Commit e push para o GitHub Pages
echo "🚀 Fazendo commit e push para o GitHub Pages..."
git add out/
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix out origin gh-pages

echo "✨ Deploy concluído! O site estará disponível em breve em $(cat CNAME)"
