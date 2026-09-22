"use client"

import type { ReactNode } from "react"

import { FinanceProvider } from "@/lib/finance-store"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <FinanceProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:hidden">
            <SidebarTrigger />
            <span className="text-sm font-semibold">Gestão Financeira</span>
          </header>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-center" richColors />
    </FinanceProvider>
  )
}
