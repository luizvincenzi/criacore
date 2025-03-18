/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'www.luizvincenzi.com', 'luizvincenzi.com'],
    unoptimized: true,
  },
  // Configuração para exportação estática
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  // Configuração para ignorar erros de páginas dinâmicas durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
