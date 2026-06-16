import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { useNavigate } from "react-router-dom"
import { UtensilsCrossed, ChevronRightIcon, SettingsIcon } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function ProfilePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("customer")
    navigate("/login")
  }

  const { name, email } = JSON.parse(localStorage.customer)
  const initials = name?.charAt(0)?.toUpperCase() ?? "?"

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="pt-6 pb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground uppercase shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-base truncate">{name}</p>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-4 space-y-1">
          <Item variant="ghost" size="sm" asChild>
            <a href="/orderhistory">
              <ItemMedia>
                <UtensilsCrossed className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Your Orders</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </a>
          </Item>
          <Item variant="ghost" size="sm" asChild>
            <a href="/account">
              <ItemMedia>
                <SettingsIcon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Account Settings</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </a>
          </Item>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  )
}
