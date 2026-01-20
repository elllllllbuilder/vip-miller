'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../../lib/auth';
import { getUsers } from '../../../lib/api';
import Link from 'next/link';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
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

      <h1>Usuários</h1>
      
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginTop: '1rem'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Telegram ID
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Nome
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Username
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>
              Criado em
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {user.telegram_user_id}
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {user.first_name} {user.last_name}
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                @{user.username || 'N/A'}
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
          Nenhum usuário encontrado
        </p>
      )}
    </div>
  );
}
