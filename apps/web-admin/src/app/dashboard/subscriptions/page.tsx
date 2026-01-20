'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../../lib/auth';
import { getSubscriptions } from '../../../lib/api';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadSubscriptions();
  }, [router]);

  const loadSubscriptions = async () => {
    try {
      const data = await getSubscriptions();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Carregando...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard">← Voltar ao Dashboard</Link>
      </div>

      <h1>Assinaturas</h1>
      
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginTop: '1rem'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Usuário
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Plano
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Status
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Expira em
            </th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {sub.user?.first_name || 'N/A'}
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {sub.plan_id}
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: sub.status === 'active' ? '#10b981' : '#ef4444',
                  color: 'white',
                  fontSize: '0.875rem'
                }}>
                  {sub.status}
                </span>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {new Date(sub.expires_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {subscriptions.length === 0 && (
        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
          Nenhuma assinatura encontrada
        </p>
      )}
    </div>
  );
}
