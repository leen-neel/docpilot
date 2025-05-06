import { type Metadata } from "next";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";
import { getDocs } from "@/lib/actions/db.actions";
import { DocsProvider } from "@/app/context/DocsContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocPilot",
  description: "Generate your API docs in seconds!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const docs = await getDocs();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body
          className={`${inter.className} antialiased dark min-h-screen bg-gradient-to-b from-background to-background/80`}
        >
          <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <header className="flex justify-between items-center mb-6 p-6 border-b border-border/20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              <Link className={spaceGrotesk.className} href="/">
                DocPilot
              </Link>
            </h1>

            <SignedIn>
              <div className="flex gap-4 items-center">
                <Link href="/new">
                  <Button className="bg-primary/90 hover:bg-primary transition-colors">
                    <Plus className="size-4" />
                    <span className="hidden md:block">Create New Doc</span>
                  </Button>
                </Link>

                <UserButton />
              </div>
            </SignedIn>
          </header>
          <DocsProvider docs={docs}>
            <main className="px-6 max-w-7xl mx-auto">{children}</main>
          </DocsProvider>

          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
