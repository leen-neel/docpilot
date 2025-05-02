import { type Metadata } from "next";

import { DocProvider } from "@/app/context/DocContext";

import "@/app/globals.css";
import { getDocById } from "@/lib/actions/db.actions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import DocSidebar from "@/components/DocSidebar";

export const metadata: Metadata = {
  title: "DocPilot",
  description: "Generate your API docs in seconds!",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <ClerkProvider>
      <DocProvider value={doc}>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased dark p-2 md:p-10`}
          >
            <SidebarProvider>
              <DocSidebar />

              <main className="w-full">{children}</main>
            </SidebarProvider>
          </body>
        </html>
      </DocProvider>
    </ClerkProvider>
  );
}
