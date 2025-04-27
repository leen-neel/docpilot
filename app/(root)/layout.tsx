import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
        >
          <header className="flex justify-between mb-10 p-10">
            <h1 className="text-4xl font-bold text-primary">
              <Link href="/">DocPilot</Link>
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

            <SignedOut>
              <SignInButton />
            </SignedOut>
          </header>
          <main className="px-10">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
