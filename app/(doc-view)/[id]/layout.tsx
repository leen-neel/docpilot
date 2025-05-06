import { type Metadata } from "next";

import { DocProvider } from "@/app/context/DocContext";

import "@/app/globals.css";
import { getDocById } from "@/lib/actions/db.actions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import DocSidebar from "@/components/DocSidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DocPilot",
  description: "Generate your API docs in seconds!",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const { id } = params;

  const doc = await getDocById(id);

  if (!doc) {
    throw new Error(`Document with id ${id} not found`);
  }

  return (
    <ClerkProvider>
      <DocProvider value={doc}>
        <html lang="en">
          <body className={`${inter.className} antialiased dark`}>
            <SidebarProvider>
              <DocSidebar />
              <Toaster richColors position="top-right" />
              <div className="p-2 md:p-10 w-full">
                <main className="w-full">{children}</main>
              </div>
            </SidebarProvider>
          </body>
        </html>
      </DocProvider>
    </ClerkProvider>
  );
}
