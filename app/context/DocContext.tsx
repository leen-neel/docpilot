"use client";

import { createContext, useContext } from "react";

import {
  apiDocs,
  endpoints,
  faqs,
  pathParams,
  queryParams,
  responses,
  sdkWrappers,
  servers,
} from "@/drizzle/schema";

type DocsType = typeof apiDocs.$inferSelect & {
  endpoints: Array<
    typeof endpoints.$inferSelect & {
      responses: (typeof responses.$inferSelect)[];
      queryParams: (typeof queryParams.$inferSelect)[];
      pathParams: (typeof pathParams.$inferSelect)[];
    }
  >;
  servers: (typeof servers.$inferSelect)[];
  faqs: (typeof faqs.$inferSelect)[];
  sdkWrappers: (typeof sdkWrappers.$inferSelect)[];
};

const DocContext = createContext<DocsType | undefined>(undefined);

export function useDoc() {
  const context = useContext(DocContext);
  if (context === undefined) {
    throw new Error("useDoc must be used within a DocProvider");
  }
  return context;
}

export function DocProvider({
  value,
  children,
}: {
  value: DocsType | null;
  children: React.ReactNode;
}) {
  if (!value) {
    throw new Error("DocProvider requires a non-null value");
  }
  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
}
