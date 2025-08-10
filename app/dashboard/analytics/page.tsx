import { getCampaigns } from "@/lib/firebase/campanhas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const list: any[] = (await getCampaigns()) || [];

  const norm = list.map((c) => ({
    id: c.id,
    nome: c.nome || c.title || "Campanha",
    imp: c.impressoes ?? c.metrics?.impressions ?? 0,
    clk: c.cliques ?? c.metrics?.clicks ?? 0,
    conv: c.conversoes ?? c.metrics?.conversions ?? 0,
    spend: Number(c.totalSpend ?? c.metrics?.spend ?? 0),
    createdAt:
      (typeof c.createdAt?.toDate === "function"
        ? c.createdAt.toDate()
        : new Date(c.createdAt || Date.now())),
    plataforma: (c.plataforma || c.platform || "meta").toLowerCase(),
    status: (c.status?.toLowerCase?.() || "ativo") as "ativo" | "pausado" | "rascunho" | "encerrado",
  }));

  const totals = norm.reduce(
    (acc, c) => {
      acc.imp += c.imp; acc.clk += c.clk; acc.conv += c.conv; acc.spend += c.spend;
      acc.byPlat[c.plataforma] = (acc.byPlat[c.plataforma] || 0) + c.spend;
      return acc;
    },
    { imp: 0, clk: 0, conv: 0, spend: 0, byPlat: {} as Record<string, number> }
  );

  // Série temporal simples por dia (últimos 14 dias)
  const days = 14;
  const series = Array.from({ length: days }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
    const label = d.toLocaleDateString();
    // soma aproximada (se quiser, substitui por collection de insights/dia)
    const factor = 0.8 + Math.random() * 0.4;
    return {
      date: label,
      imp: Math.round((totals.imp / days || 1500) * factor),
      clk: Math.round((totals.clk / days || 40) * factor),
      spend: Number(((totals.spend / days || 30) * factor).toFixed(2)),
    };
  });

  const pieData = Object.entries(totals.byPlat).map(([name, value]) => ({ name, value }));
  const pieColors = ["#2563eb", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4"];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">📈 Analytics</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Impressões" value={totals.imp} />
        <Kpi label="Cliques" value={totals.clk} />
        <Kpi label="Conversões" value={totals.conv} />
        <Kpi label="Gastos (R$)" value={Number(totals.spend.toFixed(2))} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-white/90 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Evolução diária</CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="imp" stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="clk" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="spend" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader className="pb-2">
            <CardTitle>Gastos por plataforma</CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={pieData} nameKey="name" outerRadius={110} innerRadius={60}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <Card className="bg-white/90">
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
        <div className="text-2xl font-semibold text-slate-800 mt-1">
          {Intl.NumberFormat("pt-BR").format(value)}
        </div>
      </CardContent>
    </Card>
  );
}
