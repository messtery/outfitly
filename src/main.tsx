import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { toast } from "sonner"

import "./index.css"
import App from "./App.tsx"
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider.tsx"

const _fetch = window.fetch.bind(window)
window.fetch = async (...args) => {
  const url = (() => {
    if (typeof args[0] === 'string') return args[0];
    if (args[0] instanceof URL) return args[0].toString();
    return (args[0] as Request).url;
  })();

  const isAdminRoute = url.includes('/admin/');
  const isAdminLoginEndpoint = url.includes('/admin/auth/login');

  if (isAdminRoute && !isAdminLoginEndpoint) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      if (typeof args[0] === 'string' || args[0] instanceof URL) {
        args[1] = {
          ...args[1],
          headers: { ...(args[1]?.headers ?? {}), Authorization: `Bearer ${adminToken}` },
        };
      } else {
        const req = args[0] as Request;
        args[0] = new Request(req, {
          headers: new Headers({ ...Object.fromEntries(req.headers.entries()), Authorization: `Bearer ${adminToken}` }),
        });
      }
    }
  }

  const res = await _fetch(...args);

  if (!res.ok && res.status >= 400) {
    if (res.status === 401 && isAdminRoute && !isAdminLoginEndpoint) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
      return res;
    }
    if (!isAdminLoginEndpoint) {
      const clone = res.clone();
      const msg = await clone.json().then((d: Record<string, string>) => d?.message ?? d?.error).catch(() => null);
      toast.error(msg ?? `Request failed (${res.status})`);
    }
  }

  return res;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster position="top-center"/>
    </ThemeProvider>
  </StrictMode>
)
