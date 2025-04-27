"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { dummyDoc } from "@/constants";
import { Check, Menu } from "lucide-react";
import { useState } from "react";

function Page() {
  const apiDoc = dummyDoc;

  const [selectedServer, setselectedServer] = useState(apiDoc.servers[0].url);

  return (
    <>
      <div className="fixed bottom-5 right-5 p-2">
        <Sheet>
          <SheetTrigger className="rounded-full size-10 p-0 text-black bg-primary grid place-content-center ">
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-3xl font-bold">
                {apiDoc.apiName}
              </SheetTitle>
              <SheetDescription>{apiDoc.description}</SheetDescription>
            </SheetHeader>

            <Button variant="ghost" className="justify-start">
              Endpoints
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      <section>
        <div className="flex justify-between flex-col-reverse">
          <div>
            <h2 className="text-3xl font-bold">{apiDoc.apiName}</h2>
            <p className="mt-2"> {apiDoc.description} </p>
          </div>

          <div className="mt-5">
            <Popover>
              <PopoverTrigger>Select Server</PopoverTrigger>
              <PopoverContent>
                {apiDoc.servers.map((server) => (
                  <Button
                    key={server.url}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setselectedServer(server.url)}
                  >
                    {selectedServer === server.url && (
                      <Check className="text-primary" />
                    )}

                    {server.description}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>

      <section>content</section>
    </>
  );
}

export default Page;
