// app/dashboard/campanhas/[id]/copies/page.tsx
import CopiesList from "@/components/CopiesList";

export default function CampanhaCopiesPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">📝 Copies da campanha</h1>
      <p className="text-zinc-300/80">
        Aqui você vê tudo que salvou a partir do Criativos IA.
      </p>

      <CopiesList campaignId={params.id} />
    </main>
  );
}
