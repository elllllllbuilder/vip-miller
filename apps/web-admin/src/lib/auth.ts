// Mock auth - em produção usar JWT ou OAuth
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('admin_token') === 'admin123';
}

export function login(password: string): boolean {
  if (password === 'admin123') {
    localStorage.setItem('admin_token', 'admin123');
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem('admin_token');
}
