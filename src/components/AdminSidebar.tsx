import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AdminSidebarProps = {
  currentPage?: "dashboard" | "products" | "categories" | "orders"
}

export default function AdminSidebar({ currentPage }: AdminSidebarProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>Manage your data</CardDescription>
      </CardHeader>
      <CardContent>
        <nav aria-label="Admin sidebar" className="space-y-2">
          <Button
            asChild
            variant={currentPage === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <a
              href="/admin/dashboard"
              {...(currentPage === "dashboard"
                ? { "aria-current": "page" }
                : {})}
            >
              Dashboard
            </a>
          </Button>
          <Button
            asChild
            variant={currentPage === "products" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <a
              href="/admin/products"
              {...(currentPage === "products"
                ? { "aria-current": "page" }
                : {})}
            >
              Products
            </a>
          </Button>
          <Button
            asChild
            variant={currentPage === "categories" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <a
              href="/admin/categories"
              {...(currentPage === "categories"
                ? { "aria-current": "page" }
                : {})}
            >
              Categories
            </a>
          </Button>
          <Button
            asChild
            variant={currentPage === "orders" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <a
              href="/admin/orders"
              {...(currentPage === "orders" ? { "aria-current": "page" } : {})}
            >
              Orders
            </a>
          </Button>
        </nav>
      </CardContent>
    </Card>
  )
}
