import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { ChevronRight, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { getDocsByUserId } from "@/lib/actions/db.actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  const user = await currentUser();

  const docs = user ? await getDocsByUserId(user.id) : [];

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex justify-center items-center flex-col relative overflow-hidden bg-gradient-to-b from-background to-background/80 w-full ">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background animate-pulse"></div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          <div className="text-center space-y-8 max-w-3xl px-4 relative z-10">
            <div className="flex justify-center items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <Sparkles className="w-6 h-6 text-primary/60" />
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Create <span className="text-primary">beautiful</span>{" "}
                documentation
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your ideas into stunning documentation with our
                intuitive platform. Start your journey today.
              </p>
            </div>

            <SignUpButton>
              <Button className="text-foreground text-lg px-8 py-6 rounded-full font-semibold bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {docs.length > 0 ? (
          <div className="container py-12 space-y-8">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold">
                {`Your Documentation${docs.length > 1 ? "s" : ""}`}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docs.map((doc) => (
                <Card
                  key={doc.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                >
                  <CardHeader>
                    <h2 className="font-bold text-xl group-hover:text-primary transition-colors">
                      {doc.name}
                    </h2>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground">{doc.description}</p>
                  </CardContent>

                  <CardFooter>
                    <Link href={doc.id} className="w-full">
                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        Read Documentation
                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
            <div className="p-4 rounded-full bg-primary/10">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-center">
              No docs found. Create one right now!
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              Start documenting your APIs and services with our beautiful and
              intuitive platform.
            </p>
          </div>
        )}
      </SignedIn>
    </>
  );
}
