'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../../lib/auth';
import { getPayments } from '../../../lib/api';
import Link from 'next/link';

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadPayments();
  }, [router]);

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error loading payments:', error);
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

      <h1>Pagamentos</h1>
      
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
              Valor
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Status
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {payment.user?.first_name || 'N/A'}
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                R$ {(payment.amount / 100).toFixed(2)}
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: payment.status === 'paid' ? '#10b981' : '#f59e0b',
                  color: 'white',
                  fontSize: '0.875rem'
                }}>
                  {payment.status}
                </span>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {new Date(payment.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {payments.length === 0 && (
        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
          Nenhum pagamento encontrado
        </p>
      )}
    </div>
  );
}
