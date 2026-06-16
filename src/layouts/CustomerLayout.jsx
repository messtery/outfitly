import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Bell, UtensilsCrossed, ShoppingCart, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import AIChatFAB from "@/components/AIChatFAB"

const navItems = [
  { label: "Menu", icon: UtensilsCrossed, path: "/menu" },
  { label: "Cart", icon: ShoppingCart, path: "/cart" },
  { label: "Profile", icon: User, path: "/profile" },
]

const mainPaths = ["/menu", "/cart", "/profile"]

const pageTitles = {
  "/menu": "Menu",
  "/cart": "Cart",
  "/profile": "Profile",
  "/checkout": "Checkout",
  "/orderhistory": "Order History",
  "/account": "Account Settings",
}

function getTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.startsWith("/ordertracking")) return "Track Order"
  return "Mikro Canteen"
}

export default function CustomerLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isMainPage = mainPaths.includes(location.pathname)
  const title = getTitle(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-2 px-4">
          {!isMainPage && (
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 shrink-0"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <span className="font-semibold text-base">{title}</span>
          {isMainPage && (
            <Button variant="ghost" size="icon" className="ml-auto">
              <Bell className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className={`flex-1 ${isMainPage ? "pb-16" : ""}`}>
        <Outlet />
      </main>

      {/* Bottom navigation — only on main pages */}
      {isMainPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
          <div className="flex justify-around items-center h-16">
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center gap-1 flex-1 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "stroke-[2px]" : "stroke-[1.5px]"
                    }`}
                  />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}

      <AIChatFAB />
    </div>
  )
}
