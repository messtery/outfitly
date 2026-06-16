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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: <PackageIcon />,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: <TagIcon />,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: <UsersIcon />,
    },
  ],
  navSystem: [
    {
      title: "Roles",
      url: "/admin/roles",
      icon: <ShieldIcon />,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: <UserCogIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAdminAuth()
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
        <NavMain items={data.navMain} />
        <NavMain items={data.navSystem} label="System" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
