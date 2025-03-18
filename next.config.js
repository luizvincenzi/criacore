/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'www.luizvincenzi.com', 'luizvincenzi.com'],
    unoptimized: true,
  },
  output: 'export',  // Exportação estática para GitHub Pages
  distDir: 'out',
  trailingSlash: true,  // Ajuda com a estrutura de diretórios no GitHub Pages
  // Configuração para ignorar erros de páginas dinâmicas durante o build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
