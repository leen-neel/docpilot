"use client";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useDoc } from "@/app/context/DocContext";
import { ChevronLeft, Code, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

function DocSidebar() {
  const doc = useDoc();

  const helpItems = [
    {
      link: `/${doc?.id}/sdks`,
      icon: <Code />,
      label: "SDKs",
    },
    {
      link: `/${doc?.id}/faqs`,
      icon: <MessageCircleQuestion />,
      label: "FAQs",
    },
  ];

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarHeader>
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="mb-2" />
                </Button>
              </Link>

              <div className="text-2xl font-bold">{doc?.name}</div>
              <p className="text-sm text-gray-400">{doc?.description}</p>
            </SidebarHeader>

            <SidebarGroup>
              <SidebarGroupLabel>Endpoint Reference</SidebarGroupLabel>
              {doc?.endpoints.map((endpoint) => (
                <Link
                  key={endpoint.id}
                  href={`/${doc.id}#${endpoint.method.toLowerCase()}-${
                    endpoint.path
                  }`}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton className="cursor-pointer">
                      <span className="text-primary">{endpoint.method}</span>
                      {endpoint.path}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Tools and Help</SidebarGroupLabel>

              {helpItems.map((help) => (
                <Link key={help.label} href={help.link}>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="cursor-pointer">
                      {help.icon}
                      {help.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarGroup>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    </>
  );
}

export default DocSidebar;
