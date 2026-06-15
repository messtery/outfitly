import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useNavigate } from "react-router-dom"
import { UtensilsCrossed, ChevronRightIcon } from "lucide-react"
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
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground uppercase">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-base">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Item variant="outline" size="sm" asChild>
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
