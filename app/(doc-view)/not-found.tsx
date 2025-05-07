import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const metadata: Metadata = {
  title: "Document Not Found",
  description:
    "The API documentation you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Toaster richColors position="top-right" />
        <div className="p-2 md:p-10 w-full">
          <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6">
            <div className="p-4 rounded-full bg-primary/10">
              <FileQuestion className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-center">
              Document Not Found
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              The API documentation you&apos;re looking for doesn&apos;t exist
              or has been moved.
            </p>
            <Button asChild>
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
