import { UtensilsCrossed, ShoppingCart, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const navItems = [
  { label: "Menu", icon: UtensilsCrossed, path: "/menu" },
  { label: "Cart", icon: ShoppingCart, path: "/cart" },
  { label: "Profile", icon: User, path: "/profile" },
]

export default function CustomerBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center h-16 shadow-md">
      {navItems.map(({ label, icon: Icon, path }) => {
        const isActive = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${
              isActive ? "text-black" : "text-gray-400 hover:text-gray-600"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
