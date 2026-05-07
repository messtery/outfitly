import CustomerTopBar from "../components/CustomerTopBar"
import CustomerBottomNav from "../components/CustomerBottomNav"
import AIChatFAB from "../components/AIChatFAB"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useNavigate } from "react-router-dom"
import { UtensilsCrossed, ChevronRightIcon } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"


const mockUser = {
  username: "alice_johnson",
}

const mockOrderHistory = [
  { id: "ORD-001", date: "2025-04-01", total: 38000, status: "Delivered" },
  { id: "ORD-002", date: "2025-04-10", total: 23000, status: "Delivered" },
  { id: "ORD-003", date: "2025-04-20", total: 51000, status: "Processing" },
]

export default function ProfilePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-screen pb-20 pt-14">
      <CustomerTopBar title="Profile" />

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* User info */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 uppercase">
              {mockUser.username.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-semibold text-lg">{mockUser.username}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order history */}
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

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      <CustomerBottomNav />
      <AIChatFAB />
    </div>
  )
}
