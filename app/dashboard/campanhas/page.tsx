// app/dashboard/campanhas/page.tsx
import Link from "next/link";
import { getCampaigns } from "@/lib/firebase/campanhas";
import CardCampanha from "@/components/CardCampanha";

type SearchParams = {
  q?: string;
  status?: "ativo" | "pausado" | "rascunho" | "encerrado" | "";
  plataforma?: "meta" | "google" | "ttads" | "linkedin" | "other" | "";
  sort?: "recentes" | "cliques" | "conversoes";
  page?: string;
  perPage?: string;
};

export const dynamic = "force-dynamic";

export default async function CampanhasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const {
    q = "",
    status = "",
    plataforma = "",
    sort = "recentes",
    page = "1",
    perPage = "12",
  } = searchParams || {};

  const all: any[] = (await getCampaigns()) || [];

  // Normaliza campos
  const normalized = all.map((c) => ({
    id: c.id,
    nome: c.nome || c.title || "Campanha",
    plataforma: (c.plataforma || c.platform || "meta").toLowerCase(),
    status: (c.status?.toLowerCase?.() || "ativo") as
      | "ativo"
      | "pausado"
      | "rascunho"
      | "encerrado",
    usarIa: c.usarIa ?? c.ia ?? false,
    impressoes: c.impressoes ?? c.metrics?.impressions ?? 0,
    cliques: c.cliques ?? c.metrics?.clicks ?? 0,
    conversoes: c.conversoes ?? c.metrics?.conversions ?? 0,
    createdAt:
      (typeof c.createdAt?.toDate === "function"
        ? c.createdAt.toDate().getTime()
        : Number(new Date(c.createdAt || c.created_at || c.created || Date.now()))) ||
      Date.now(),
  }));

  // Contadores
  const counts = normalized.reduce(
    (acc, c) => {
      acc.total++;
      if (c.status === "ativo") acc.ativo++;
      else if (c.status === "pausado") acc.pausado++;
      else if (c.status === "rascunho") acc.rascunho++;
      else if (c.status === "encerrado") acc.encerrado++;
      return acc;
    },
    { total: 0, ativo: 0, pausado: 0, rascunho: 0, encerrado: 0 }
  );

  // Filtros
  let filtered = normalized.filter((c) => {
    const byQ =
      !q ||
      c.nome.toLowerCase().includes(q.toLowerCase()) ||
      c.plataforma.toLowerCase().includes(q.toLowerCase());
    const byStatus = !status || c.status === status;
    const byPlat = !plataforma || c.plataforma === plataforma;
    return byQ && byStatus && byPlat;
  });

  // Ordenação
  filtered = filtered.sort((a, b) => {
    if (sort === "cliques") return b.cliques - a.cliques;
    if (sort === "conversoes") return b.conversoes - a.conversoes;
    return b.createdAt - a.createdAt; // recentes
  });

  // Paginação
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const size = Math.min(48, Math.max(6, parseInt(perPage || "12", 10)));
  const start = (currentPage - 1) * size;
  const end = start + size;
  const pageItems = filtered.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(filtered.length / size));

  // Helper para QS
  const qs = (patch: Partial<SearchParams>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (plataforma) params.set("plataforma", plataforma);
    if (sort) params.set("sort", sort);
    params.set("perPage", String(size));
    params.set("page", String(patch.page ?? currentPage));
    if (patch.q !== undefined) params.set("q", patch.q);
    if (patch.status !== undefined) params.set("status", patch.status || "");
    if (patch.plataforma !== undefined)
      params.set("plataforma", patch.plataforma || "");
    if (patch.sort !== undefined) params.set("sort", patch.sort);
    return `?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white">📢 Campanhas</h1>
        <Link
          href="/dashboard/campanhas/nova"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nova Campanha com IA
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi label="Total" value={counts.total} />
        <Kpi label="Ativas" value={counts.ativo} badgeClass="bg-emerald-500" />
        <Kpi label="Pausadas" value={counts.pausado} badgeClass="bg-amber-500" />
        <Kpi label="Rascunhos" value={counts.rascunho} badgeClass="bg-slate-500" />
        <Kpi label="Encerradas" value={counts.encerrado} badgeClass="bg-rose-500" />
      </div>

      {/* Filtros */}
      <form method="GET" className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou plataforma..."
          className="md:col-span-2 rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Status (todos)</option>
          <option value="ativo">Ativo</option>
          <option value="pausado">Pausado</option>
          <option value="rascunho">Rascunho</option>
          <option value="encerrado">Encerrado</option>
        </select>
        <select
          name="plataforma"
          defaultValue={plataforma}
          className="rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Plataforma (todas)</option>
          <option value="meta">Meta</option>
          <option value="google">Google</option>
          <option value="ttads">TikTok Ads</option>
          <option value="linkedin">LinkedIn</option>
          <option value="other">Outras</option>
        </select>
        <div className="flex gap-2">
          <select
            name="sort"
            defaultValue={sort}
            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recentes">Ordenar: Recentes</option>
            <option value="cliques">Ordenar: Mais Cliques</option>
            <option value="conversoes">Ordenar: Mais Conversões</option>
          </select>
          <button
            type="submit"
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Filtrar
          </button>
        </div>
        {/* reset de página */}
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="perPage" value={size} />
      </form>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <div className="text-center text-zinc-300/80 py-20 border border-white/10 rounded-xl bg-white/5">
          <p className="text-lg">Nenhuma campanha encontrada.</p>
          <p className="text-sm">
            Ajuste os filtros ou{" "}
            <Link href="/dashboard/campanhas/nova" className="underline text-blue-400">
              crie sua primeira campanha com IA
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pageItems.map((c) => (
            <CardCampanha
              key={c.id}
              campanha={{
                id: c.id,
                nome: c.nome,
                plataforma: c.plataforma,
                status: c.status,
                ia: c.usarIa,
                impressoes: c.impressoes,
                cliques: c.cliques,
                conversoes: c.conversoes,
              }}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {filtered.length > size && (
        <div className="flex items-center justify-between gap-3 pt-4">
          <div className="text-zinc-300/80 text-sm">
            Mostrando{" "}
            <strong>
              {start + 1}–{Math.min(end, filtered.length)}
            </strong>{" "}
            de <strong>{filtered.length}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Link
              aria-disabled={currentPage <= 1}
              className={`px-3 py-2 rounded-md text-sm border border-white/10 ${
                currentPage <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"
              }`}
              href={qs({ page: String(currentPage - 1) })}
            >
              ← Anterior
            </Link>
            <span className="text-zinc-300/80 text-sm">
              Página {currentPage} / {totalPages}
            </span>
            <Link
              aria-disabled={currentPage >= totalPages}
              className={`px-3 py-2 rounded-md text-sm border border-white/10 ${
                currentPage >= totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"
              }`}
              href={qs({ page: String(currentPage + 1) })}
            >
              Próxima →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({
  label,
  value,
  badgeClass = "bg-white/10",
}: {
  label: string;
  value: number;
  badgeClass?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-400">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
        <span className={`inline-flex h-2 w-2 rounded-full ${badgeClass}`} />
      </div>
    </div>
  );
}
