import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${inter.className} antialiased dark`}>
          <header className="flex justify-between mb-10 p-10">
            <h1 className="text-4xl font-bold text-primary">
              <Link className={spaceGrotesk.className} href="/">
                DocPilot
              </Link>
            </h1>

            <SignedIn>
              <div className="flex gap-5">
                <Link href="/new">
                  <Button>
                    <Plus />
                    <span className="hidden md:block">Create New Doc</span>
                  </Button>
                </Link>

                <UserButton />
              </div>
            </SignedIn>
          </header>
          <main className="px-10">{children}</main>

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
