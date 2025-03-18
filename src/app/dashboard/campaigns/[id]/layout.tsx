// Esta função é necessária para exportação estática com Next.js
export async function generateStaticParams() {
  // Para exportação estática, definimos IDs estáticos para pré-renderização
  // Isso permite que o build seja concluído sem depender de dados externos
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'new' }
  ]
}

export default function CampaignLayout({
  children,
}: {
  children: any
}) {
  return <>{children}</>
}
