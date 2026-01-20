import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP System - Admin',
  description: 'Painel administrativo do sistema VIP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
