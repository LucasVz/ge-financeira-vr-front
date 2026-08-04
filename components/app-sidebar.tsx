"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  Tags,
  TrendingUp,
  TrendingDown,
  BarChart3,
  HeartPulse,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/servicos", label: "Register Services", icon: ClipboardList },
  { href: "/formas-pagamento", label: "Payment Methods", icon: CreditCard },
  { href: "/categorias", label: "Categories", icon: Tags },
  { href: "/entradas", label: "Register Income", icon: TrendingUp },
  { href: "/saidas", label: "Register Expense", icon: TrendingDown },
  { href: "/relatorios", label: "Visual Reports", icon: BarChart3 },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Rebeca Vaz Clinic
            </span>
            <span className="text-xs text-muted-foreground">Financial Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <User className="size-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-sidebar-foreground">
              Administrator
            </span>
            <span className="text-xs text-muted-foreground">admin@clinica.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
