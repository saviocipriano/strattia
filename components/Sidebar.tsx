"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  BarChart4,
  FileCheck2,
  Users2,
  ClipboardList,
  FileText,
  ShieldCheck,
  BellRing,
  Megaphone,
  Image,
  Rocket,
  Globe,
  PencilRuler,
  Layers,
  Wallet2,
  DollarSign,
  UserCog,
  Settings,
  LogOut,
  HelpCircle,
  Book,
  Building2,
  CalendarDays,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Zap,
  FileSpreadsheet,
  Flame,
  Sparkle,
  AlertCircle,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navSections = [
  {
    label: "Painel",
    items: [
      { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
      { href: "/dashboard/relatorios", label: "Relatórios & Analytics", icon: BarChart4 },
      { href: "/dashboard/ia-trafego", label: "IA de Tráfego", icon: Bot, badge: "BETA" },
      { href: "/dashboard/notificacoes", label: "Notificações", icon: BellRing, badge: "•", badgeClass: "bg-red-500" },
    ],
  },
  {
    label: "Tráfego & Performance",
    items: [
      { href: "/dashboard/campanhas", label: "Campanhas", icon: Megaphone },
      { href: "/dashboard/criativos-ia", label: "Criativos IA", icon: Image },
      { href: "/dashboard/lancamentos", label: "Lançamentos", icon: Rocket },
      { href: "/dashboard/analytics", label: "Analytics Avançado", icon: TrendingUp },
      { href: "/dashboard/copy-ia", label: "Copy Automática", icon: Sparkle },
    ],
  },
  {
    label: "Leads, CRM & Clientes",
    items: [
      { href: "/dashboard/leads", label: "Leads", icon: ClipboardList },
      { href: "/dashboard/funil", label: "Funil de Vendas", icon: Layers },
      { href: "/dashboard/clientes", label: "Clientes", icon: Users2 },
      { href: "/dashboard/crm360", label: "CRM 360º", icon: Building2 },
      { href: "/dashboard/atividades", label: "Atividades", icon: CalendarDays },
    ],
  },
  {
    label: "Propostas & Contratos",
    items: [
      { href: "/dashboard/propostas", label: "Propostas", icon: ShieldCheck },
      { href: "/dashboard/contratos", label: "Contratos", icon: FileText },
      { href: "/dashboard/assinaturas", label: "Assinaturas", icon: Flame },
    ],
  },
  {
    label: "LPs, Sites & Produtos",
    items: [
      { href: "/dashboard/lps-ia", label: "Landing Pages IA", icon: Globe },
      { href: "/dashboard/sites", label: "Sites Automáticos", icon: PencilRuler },
      { href: "/dashboard/produtos", label: "Produtos & Serviços", icon: FileSpreadsheet },
    ],
  },
  {
    label: "Automação & Integrações",
    items: [
      { href: "/dashboard/automacoes", label: "Automações", icon: Zap },
      { href: "/dashboard/integracoes", label: "Integrações", icon: Layers },
      { href: "/dashboard/marketplace", label: "Marketplace", icon: Wallet2, badge: "Novo" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/dashboard/financeiro", label: "Financeiro", icon: DollarSign },
      { href: "/dashboard/recebiveis", label: "Recebíveis", icon: Wallet2 },
    ],
  },
  {
    label: "Central & Suporte",
    items: [
      { href: "/dashboard/usuarios", label: "Usuários & Equipe", icon: UserCog },
      { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
      { href: "/dashboard/suporte", label: "Suporte", icon: HelpCircle },
      { href: "/dashboard/base-conhecimento", label: "Central de Conhecimento", icon: Book },
      { href: "/dashboard/alertas", label: "Alertas & Logs", icon: AlertCircle },
      { href: "/dashboard/comunicados", label: "Comunicados", icon: Mail },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fecha sidebar mobile ao clicar em link
  function handleLinkClick() {
    if (window.innerWidth < 1024) setMobileOpen(false);
  }

  return (
    <>
      {/* Botão hambúrguer no topo para mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 rounded-full bg-blue-900 p-2 shadow-md text-blue-100 hover:bg-blue-800 transition"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar principal */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-[#10182A] shadow-2xl flex flex-col justify-between
          transition-all duration-300
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        style={{ maxHeight: "100vh" }}
      >
        {/* Logo e botão colapsar */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-blue-900 min-w-0">
          <span
            className={`font-black tracking-tight text-2xl transition-all duration-300 truncate ${
              collapsed ? "text-[0px] w-0" : "text-blue-400 w-auto"
            }`}
          >
            Strattia
          </span>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-full p-2 hover:bg-blue-900/30 transition ml-auto hidden lg:block"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        {/* Conteúdo do menu com SCROLL */}
        <nav
          className="mt-4 flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent pr-1"
          style={{ maxHeight: "calc(100vh - 170px)" }} // Ajusta conforme tamanho do footer
        >
          {navSections.map((section, idx) => (
            <div key={section.label} className="mb-2 min-w-0">
              {!collapsed && (
                <div className="px-6 py-1 text-xs text-blue-300 tracking-wider uppercase">{section.label}</div>
              )}
              {section.items.map((link) => {
                const active = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
                return (
                  <Link
                    href={link.href}
                    key={link.href}
                    className={`
                      group flex items-center gap-3 px-6 py-3 text-base font-medium rounded-xl transition
                      ${active ? "bg-gradient-to-r from-blue-900 to-blue-800/60 text-blue-200 shadow" : "text-blue-100 hover:bg-blue-800/50"}
                      ${collapsed ? "justify-center px-2" : ""}
                      relative min-w-0
                    `}
                    onClick={handleLinkClick}
                  >
                    <link.icon className="w-5 h-5 flex-shrink-0" />
                    <span
                      className={`transition-all duration-300 truncate ${
                        collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                      }`}
                    >
                      {link.label}
                    </span>
                    {/* BADGES/NOTIFICAÇÕES */}
                    {link.badge && !collapsed && (
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${link.badgeClass || "bg-blue-900 text-blue-400"}`}>
                        {link.badge}
                      </span>
                    )}
                    {/* Tooltip quando colapsado */}
                    {collapsed && (
                      <span className="absolute left-full ml-2 px-3 py-1 rounded bg-blue-950 text-xs text-blue-100 shadow opacity-0 group-hover:opacity-100 pointer-events-none transition z-50 whitespace-nowrap">
                        {link.label}
                        {link.badge && (
                          <span className={`ml-2 ${link.badgeClass || "text-blue-400"}`}>{link.badge}</span>
                        )}
                      </span>
                    )}
                  </Link>
                );
              })}
              {/* Separador visual entre seções */}
              {!collapsed && idx < navSections.length - 1 && <div className="mx-6 border-t border-blue-900 my-1" />}
            </div>
          ))}
        </nav>
        {/* Botão de logout sempre fixo */}
        <div className="p-6 pb-8 border-t border-blue-900 bg-[#10182A]">
          <button
            className={`
              flex items-center gap-2 text-blue-300 hover:text-red-400 transition w-full
              ${collapsed ? "justify-center" : ""}
            `}
            onClick={() => {
              window.location.href = "/logout";
            }}
          >
            <LogOut className="w-5 h-5" />
            <span
              className={`transition-all duration-300 ${
                collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
            >
              Sair
            </span>
          </button>
        </div>
      </aside>
      {/* Overlay para fechar sidebar no mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
