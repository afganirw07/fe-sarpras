"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";

export function AppSidebar() {
  return (
    <Sidebar side="right" className="flex h-screen lg:hidden">
      <SidebarContent className="bg-white text-blue-600">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Menu</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="mb-2 hover:bg-purple-600/30 hover:text-blue-600"
            >
              <Link href={"/"}>Home</Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              className="mb-2 hover:bg-purple-600/30 hover:text-blue-600"
            >
              <Link href={"/"}>About</Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              className="mb-2 hover:bg-purple-600/30 hover:text-blue-600"
            >
              <Link href={"/"}>Contact</Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              className="mb-2 hover:bg-purple-600/30 hover:text-blue-600"
            >
              <Button>
                <Link href={"auth/login"}>Login</Link>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white text-center text-blue-600">
        Vy
      </SidebarFooter>
    </Sidebar>
  );
}
