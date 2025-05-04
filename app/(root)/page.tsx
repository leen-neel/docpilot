import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getDocs } from "@/lib/actions/db.actions";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

async function Page() {
  const docs = await getDocs();

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex justify-center items-center flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
          <div className="text-center space-y-6 max-w-2xl px-4">
            <div className="flex justify-center">
              <FileText className="w-16 h-16 mb-4" />
            </div>
            <h2 className="text-5xl font-bold tracking-tight">
              Create <span className="text-yellow-300">beautiful</span>{" "}
              documentation
            </h2>
            <p className="text-xl opacity-90">
              Transform your ideas into stunning documentation with our
              intuitive platform. Start your journey today.
            </p>
            <SignUpButton>
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {docs.map((doc) => (
              <Card key={doc.id}>
                <CardHeader>
                  <h2 className="font-bold"> {doc.name} </h2>
                </CardHeader>

                <CardContent>
                  <p> {doc.description} </p>
                </CardContent>

                <CardFooter>
                  <Link href={doc.id}>
                    <Button>
                      Read Documentation
                      <ChevronRight />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid place-content-center min-h-screen text-3xl font-bold opacity-70">
            No docs found. Create one right now!
          </div>
        )}
      </SignedIn>
    </>
  );
}

export default Page;
