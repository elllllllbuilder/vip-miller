'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard VIP System</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <Link href="/dashboard/users" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '2rem',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <h2>👥 Usuários</h2>
            <p>Gerenciar usuários do sistema</p>
          </div>
        </Link>

        <Link href="/dashboard/subscriptions" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '2rem',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <h2>📋 Assinaturas</h2>
            <p>Ver assinaturas ativas e expiradas</p>
          </div>
        </Link>

        <Link href="/dashboard/payments" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '2rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <h2>💳 Pagamentos</h2>
            <p>Histórico de pagamentos</p>
          </div>
        </Link>

        <Link href="/dashboard/campaigns" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '2rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <h2>📢 Campanhas</h2>
            <p>Gerenciar campanhas e funis</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
