import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

function Page() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardHeader>
            <h2 className="font-bold">Blog API</h2>
          </CardHeader>

          <CardContent>
            <p>Fetch blog details</p>
          </CardContent>

          <CardFooter>
            <Link href="/test-api">
              <Button>
                Read Documentation
                <ChevronRight />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Page;
