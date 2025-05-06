"use client";

import { createContext, useContext, ReactNode } from "react";
import { apiDocs } from "@/drizzle/schema";

interface DocsContextType {
  docs: (typeof apiDocs.$inferSelect)[];
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export function DocsProvider({
  children,
  docs,
}: {
  children: ReactNode;
  docs: (typeof apiDocs.$inferSelect)[];
}) {
  return (
    <DocsContext.Provider value={{ docs }}>{children}</DocsContext.Provider>
  );
}

export function useDocs() {
  const context = useContext(DocsContext);
  if (context === undefined) {
    throw new Error("useDocs must be used within a DocsProvider");
  }
  return context;
}
