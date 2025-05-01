import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getDocs } from "@/lib/actions/db.actions";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

async function Page() {
  const docs = await getDocs();

  return (
    <>
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
    </>
  );
}

export default Page;
