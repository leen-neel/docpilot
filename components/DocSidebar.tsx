"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useDoc } from "@/app/context/DocContext";
import {
  ChevronLeft,
  Code,
  MessageCircleQuestion,
  ServerIcon,
  Terminal,
  ExternalLink,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function DocSidebar() {
  const doc = useDoc();
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/delete-doc/${doc?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const helpItems = [
    {
      link: `/${doc?.id}/sdks`,
      icon: <Code className="w-5 h-5" />,
      label: "SDKs",
    },
    {
      link: `/${doc?.id}/faqs`,
      icon: <MessageCircleQuestion className="w-5 h-5" />,
      label: "FAQs",
    },
    {
      link: `/${doc?.id}/mock-server`,
      icon: <ServerIcon className="w-5 h-5" />,
      label: "Mock Server",
    },
    {
      link: `/${doc?.id}/api-console`,
      icon: <Terminal className="w-5 h-5" />,
      label: "API Console",
    },
  ];

  const categorizedEndpoints = doc?.endpoints.reduce((acc, endpoint) => {
    const category = endpoint.cateogry || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(endpoint);
    return acc;
  }, {} as Record<string, typeof doc.endpoints>);

  return (
    <Sidebar className="border-r border-border/40 flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarMenu className="flex flex-col h-full">
        <SidebarHeader className="px-4 py-4 flex-shrink-0 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="text-lg font-semibold tracking-tight">
                {doc?.name}
              </div>
              <p className="text-sm text-muted-foreground/80 line-clamp-1">
                {doc?.description}
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3 flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
              API Reference
            </SidebarGroupLabel>
            <div className="mt-1.5 space-y-2">
              {Object.entries(categorizedEndpoints || {}).map(
                ([category, endpoints]) => (
                  <Collapsible key={category} defaultOpen>
                    <SidebarGroup>
                      <CollapsibleTrigger className="w-full group">
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground/80 bg-muted/20 rounded-md flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                          <span>{category}</span>
                          <ChevronDown className="ml-auto w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 space-y-0.5">
                        {endpoints.map((endpoint) => (
                          <Link
                            key={endpoint.id}
                            href={`/${
                              doc.id
                            }#${endpoint.method.toLowerCase()}-${
                              endpoint.path
                            }`}
                          >
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                className={cn(
                                  "w-full cursor-pointer px-2 py-1.5 rounded-md text-sm",
                                  "hover:bg-primary/5 transition-colors",
                                  "flex items-center gap-2"
                                )}
                              >
                                <span
                                  className={cn(
                                    "px-1.5 py-0.5 rounded text-xs font-medium",
                                    endpoint.method === "GET" &&
                                      "bg-blue-500/10 text-blue-500",
                                    endpoint.method === "POST" &&
                                      "bg-green-500/10 text-green-500",
                                    endpoint.method === "PUT" &&
                                      "bg-yellow-500/10 text-yellow-500",
                                    endpoint.method === "DELETE" &&
                                      "bg-red-500/10 text-red-500",
                                    endpoint.method === "PATCH" &&
                                      "bg-yellow-500/10 text-yellow-500"
                                  )}
                                >
                                  {endpoint.method}
                                </span>
                                <span className="truncate text-muted-foreground/90">
                                  {endpoint.path}
                                </span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                )
              )}
            </div>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
              Tools & Resources
            </SidebarGroupLabel>
            <div className="mt-1.5 space-y-0.5">
              {helpItems.map((help) => (
                <Link key={help.label} href={help.link}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "w-full cursor-pointer px-2 py-1.5 rounded-md text-sm",
                        "hover:bg-primary/5 transition-colors",
                        "flex items-center gap-2",
                        pathname === help.link && "bg-primary/10 text-primary"
                      )}
                    >
                      {help.icon}
                      <span className="text-muted-foreground/90">
                        {help.label}
                      </span>
                      {pathname === help.link && (
                        <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </div>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 py-3 border-t border-border/40 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground/70">
              Delete Documentation
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Documentation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this documentation? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SidebarFooter>
      </SidebarMenu>
    </Sidebar>
  );
}

export default DocSidebar;
