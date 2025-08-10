// app/layout.tsx
import '../styles/globals.css';
import type { Metadata } from 'next';
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'Strattia',
  description: 'Plataforma inteligente de gestão de tráfego com IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
