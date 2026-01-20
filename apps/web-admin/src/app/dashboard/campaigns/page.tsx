'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../../lib/auth';
import Link from 'next/link';

export default function CampaignsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard">← Voltar ao Dashboard</Link>
      </div>

      <h1>Campanhas e Funis</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Funis Ativos</h2>
        
        <div style={{ marginTop: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h3>🎯 Funil VIP</h3>
            <p>Sequência de boas-vindas para membros VIP</p>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              3 mensagens configuradas
            </p>
          </div>

          <div style={{ 
            padding: '1rem', 
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h3>💰 Funil de Vendas - Primeira Visita</h3>
            <p>Sequência para novos usuários</p>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              3 mensagens configuradas
            </p>
          </div>

          <div style={{ 
            padding: '1rem', 
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}>
            <h3>🔄 Funil de Vendas - Retorno</h3>
            <p>Sequência para usuários que retornam</p>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              3 mensagens configuradas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
