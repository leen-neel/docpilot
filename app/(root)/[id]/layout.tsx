import { type Metadata } from "next";

import { DocProvider } from "@/app/context/DocContext";

import "@/app/globals.css";
import { getDocById } from "@/lib/actions/db.actions";

export const metadata: Metadata = {
  title: "DocPilot",
  description: "Generate your API docs in seconds!",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const { id } = await params;

  const doc = await getDocById(id);

  return (
    <DocProvider value={doc}>
      <div>{children}</div>
    </DocProvider>
  );
}
