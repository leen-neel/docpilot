import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

function Page() {
  return (
    <>
      <div className="flex justify-between mb-10">
        <h1 className="text-4xl font-bold text-primary">DocPilot</h1>

        <Link href="/create">
          <Button>Create New Doc</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <h2 className="font-bold">Sex Management API</h2>
          </CardHeader>

          <CardContent>
            <p>Manage user&apos;s sex and sex the cat while sexing the dogs.</p>
          </CardContent>

          <CardFooter>
            <Button>Read Documentation</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Page;
