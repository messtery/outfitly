import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocation, useNavigate } from "react-router-dom"

type Item = {
  title: string
  url: string
  icon?: React.ReactNode
}

export function NavMain({
  items,
  label,
}: {
  items: Item[]
  label?: string
}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} onClick={() => navigate(item.url)}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname.startsWith(item.url)}
                className="data-[active=true]:text-sidebar-primary data-[active=true]:bg-sidebar-primary/10"
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
