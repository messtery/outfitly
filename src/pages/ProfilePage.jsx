import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"
import { UtensilsCrossed, Settings, ChevronRight, LogOut } from "lucide-react"

export default function ProfilePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("customer")
    navigate("/login")
  }

  const { name = "User", email = "" } = JSON.parse(localStorage.customer ?? "{}")
  const initials = name?.charAt(0)?.toUpperCase() ?? "?"

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-10 space-y-4">
      {/* Profile card */}
      <div className="rounded-2xl border bg-card p-6 flex flex-col items-center text-center gap-3">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-bold text-3xl leading-none">{initials}</span>
        </div>
        <div>
          <p className="text-xl font-bold tracking-tight">{name}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{email}</p>
        </div>
      </div>

      {/* Navigation card */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <button
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
          onClick={() => navigate("/orders")}
        >
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left text-sm font-medium">Your Orders</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <Separator />
        <button
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
          onClick={() => navigate("/account")}
        >
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left text-sm font-medium">Account Settings</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  )
}
