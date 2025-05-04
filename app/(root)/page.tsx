import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getDocs } from "@/lib/actions/db.actions";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

async function Page() {
  const docs = await getDocs();

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex justify-center items-center flex-col">
          <h2 className="text-4xl font-bold mb-5">
            Want to start creating <span>awesome</span> docs?{" "}
          </h2>

          <SignUpButton>
            <Button>Sign Up</Button>
          </SignUpButton>
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
