import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="bg-primary text-white py-10 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">CriaCore</h1>
          <p className="text-xl mb-8">
            Conecte sua marca a criadores de conteúdo para campanhas de marketing baseadas em desempenho
          </p>
          <Link href="/auth/signup" className="btn-secondary inline-block">
            Comece agora
          </Link>
        </div>
      </header>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">1</div>
              </div>
              <h3 className="text-xl font-bold mb-2">Crie sua campanha</h3>
              <p>Defina objetivos, regras e recompensas para sua campanha de marketing com influenciadores.</p>
            </div>
            
            <div className="card text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">2</div>
              </div>
              <h3 className="text-xl font-bold mb-2">Conecte-se com criadores</h3>
              <p>Influenciadores se inscrevem e criam conteúdo autêntico promovendo sua marca.</p>
            </div>
            
            <div className="card text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">3</div>
              </div>
              <h3 className="text-xl font-bold mb-2">Acompanhe resultados</h3>
              <p>Monitore o desempenho em tempo real e pague apenas pelos resultados obtidos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-primary text-white p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Marketing baseado em desempenho</h3>
                <p>Pague apenas pelos resultados reais. Nosso sistema único de rastreamento de cupons permite medir conversões diretas.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-primary text-white p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Acesso a criadores autênticos</h3>
                <p>Conecte-se com influenciadores que realmente se alinham com sua marca e podem impactar seu público-alvo.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-primary text-white p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Analytics em tempo real</h3>
                <p>Acompanhe o desempenho das suas campanhas com métricas detalhadas e insights acionáveis.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-primary text-white p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Economize tempo e recursos</h3>
                <p>Automatize processos de comunicação e gestão de campanhas para focar no que realmente importa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar seu marketing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de marcas que já estão aproveitando o poder do marketing com influenciadores baseado em desempenho.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?type=brand" className="bg-white text-secondary hover:bg-gray-100 font-bold py-3 px-6 rounded transition-colors">
              Sou uma marca
            </Link>
            <Link href="/auth/signup?type=creator" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded transition-colors">
              Sou um criador
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CriaCore</h3>
              <p className="mb-4">Conectando marcas e criadores para resultados extraordinários.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="hover:text-primary-light">Funcionalidades</Link></li>
                <li><Link href="/pricing" className="hover:text-primary-light">Preços</Link></li>
                <li><Link href="/case-studies" className="hover:text-primary-light">Casos de Sucesso</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-primary-light">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-primary-light">Guias</Link></li>
                <li><Link href="/support" className="hover:text-primary-light">Suporte</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-primary-light">Sobre nós</Link></li>
                <li><Link href="/contact" className="hover:text-primary-light">Contato</Link></li>
                <li><Link href="/careers" className="hover:text-primary-light">Carreiras</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} CriaCore. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-primary-light">Termos</Link>
              <Link href="/privacy" className="hover:text-primary-light">Privacidade</Link>
              <Link href="/cookies" className="hover:text-primary-light">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
