import React, { createContext, useContext, useState } from 'react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  roleName: string | null;
  permissions: string[];
  isRoot: boolean;
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateAuth: (token: string, user: AdminUser) => void;
  hasPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const TOKEN_KEY = 'adminToken';
const USER_KEY = 'adminUser';

function normalizeUser(raw: unknown): AdminUser {
  const u = raw as Partial<AdminUser> & Record<string, unknown>;
  return {
    id: u.id as number,
    name: u.name as string,
    email: u.email as string,
    roleId: (u.roleId ?? null) as number | null,
    roleName: (u.roleName ?? null) as string | null,
    permissions: Array.isArray(u.permissions) ? u.permissions : [],
    isRoot: Boolean(u.isRoot),
  };
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try { return normalizeUser(JSON.parse(stored)); } catch { return null; }
  });

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? 'Login failed');
    const normalized = normalizeUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    setToken(data.token);
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const updateAuth = (newToken: string, newUser: AdminUser) => {
    const normalized = normalizeUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    setToken(newToken);
    setUser(normalized);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.isRoot) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, login, logout, updateAuth, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
