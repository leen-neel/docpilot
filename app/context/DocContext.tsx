// app/context/UserContext.tsx
"use client";

import { ApiDocWithRelations } from "@/types";
import { createContext, useContext } from "react";

const DocContext = createContext<ApiDocWithRelations | null>(null);

export function useDoc() {
  return useContext(DocContext);
}

export function DocProvider({
  value,
  children,
}: {
  value: ApiDocWithRelations;
  children: React.ReactNode;
}) {
  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
}
