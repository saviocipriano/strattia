// app/dashboard/campanhas/page.tsx
import { getCampaigns } from "@/lib/firebase/campanhas"
import Link from "next/link"
import CardCampanha from "@/components/CardCampanha";

export default async function CampanhasPage() {
  const campanhas: any[] = await getCampaigns()

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">📢 Campanhas</h1>
        <Link
          href="/dashboard/campanhas/nova"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nova Campanha com IA
        </Link>
      </div>

      {campanhas.length === 0 ? (
        <div className="text-center text-zinc-400 py-20">
          <p className="text-lg">Nenhuma campanha encontrada.</p>
          <p className="text-sm">Crie sua primeira campanha com IA!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campanhas.map((campanha) => (
            <CardCampanha key={campanha.id} campanha={{
              id: campanha.id,
              nome: campanha.nome,
              plataforma: campanha.plataforma,
              status: campanha.status?.toLowerCase() || "ativo",
              ia: campanha.usarIa ?? campanha.ia ?? false,
              impressoes: campanha.impressoes ?? 0,
              cliques: campanha.cliques ?? 0,
              conversoes: campanha.conversoes ?? 0,
            }} />
          ))}
        </div>
      )}
    </div>
  )
}
