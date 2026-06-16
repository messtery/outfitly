import { Navigate, Outlet } from "react-router-dom"

export default function GuestLayout() {
  const token = localStorage.getItem("token")

  if (token) {
    return <Navigate to="/menu" replace />
  }

  return <Outlet />
}
