import * as React from "react"
import { useNavigate } from "react-router-dom"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, PackageIcon, TagIcon, ShoppingCartIcon, UsersIcon, CommandIcon, ShieldIcon, UserCogIcon } from "lucide-react"
import { useAdminAuth } from "@/context/AdminAuthContext"

const NAV_MAIN = [
  { title: "Dashboard", url: "/admin/dashboard", icon: <LayoutDashboardIcon />, permission: null },
  { title: "Products", url: "/admin/products", icon: <PackageIcon />, permission: "products.view" },
  { title: "Categories", url: "/admin/categories", icon: <TagIcon />, permission: "categories.view" },
  { title: "Orders", url: "/admin/orders", icon: <ShoppingCartIcon />, permission: "orders.view" },
  { title: "Customers", url: "/admin/customers", icon: <UsersIcon />, permission: "customers.view" },
]

const NAV_SYSTEM = [
  { title: "Roles", url: "/admin/roles", icon: <ShieldIcon />, permission: "roles.view" },
  { title: "Users", url: "/admin/users", icon: <UserCogIcon />, permission: "users.view" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout, hasPermission } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const sidebarUser = {
    name: user?.name ?? '',
    email: user?.email ?? '',
    avatar: '',
  }

  const visibleMain = NAV_MAIN.filter(item => item.permission === null || hasPermission(item.permission))
  const visibleSystem = NAV_SYSTEM.filter(item => hasPermission(item.permission))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Mikro Canteen</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleMain} />
        {visibleSystem.length > 0 && <NavMain items={visibleSystem} label="System" />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
