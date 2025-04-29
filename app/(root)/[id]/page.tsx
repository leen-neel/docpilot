import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { getDocs } from "@/lib/actions/db.actions";
import { Check, Code, Menu, Server } from "lucide-react";
import Link from "next/link";

async function Page() {
  const apiDoc = await getDocs();

  // const [selectedServer, setSelectedServer] = useState(apiDoc.servers[0].url);

  return (
    <>
      {/* Floating Menu */}
      <div className="fixed bottom-5 right-5 p-2">
        <Sheet>
          <SheetTrigger className="rounded-full size-10 p-0 text-black bg-primary grid place-content-center">
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-3xl font-bold">
                {apiDoc?.name}
              </SheetTitle>
              <SheetDescription>{apiDoc?.description}</SheetDescription>
            </SheetHeader>

            <Button variant="ghost" className="justify-start">
              <Server />
              Endpoints
            </Button>

            <Link href={`/${apiDoc?.id}/sdks`}>
              <Button variant="ghost" className="justify-start">
                <Code />
                SDKs
              </Button>
            </Link>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Section */}
      <section className="px-5">
        <div className="flex justify-between flex-col-reverse md:flex-row">
          <div>
            <h2 className="text-4xl font-bold">{apiDoc?.name}</h2>
            <p className="mt-2 text-gray-300">{apiDoc?.description}</p>
          </div>

          {/* Server Selector */}
          {/* <div className="mb-5 md:mt-5">
            <Popover>
              <PopoverTrigger className="border p-2 rounded-md">
                Server: {selectedServer}
              </PopoverTrigger>
              <PopoverContent className="w-[200px]">
                {apiDoc.servers.map((server) => (
                  <Button
                    key={server.url}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedServer(server.url)}
                  >
                    {selectedServer === server.url && (
                      <Check className="text-primary mr-2" />
                    )}
                    {server.description}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div> */}
        </div>

        <div className="flex flex-col gap-16 mt-10">
          {apiDoc?.endpoints.map((endpoint) => (
            <div key={endpoint.id} className="border p-5 rounded-lg shadow-md">
              <h3 className="text-2xl font-mono mb-2">
                <span className="text-primary">{endpoint.method}</span>{" "}
                {endpoint.path}
              </h3>
              <p className="text-gray-400 mb-5">{endpoint.description}</p>

              {endpoint.security ? (
                <div className="mb-5">
                  <p className="font-bold">Security:</p>
                  <p>{String(endpoint?.security)}</p>
                </div>
              ) : (
                ""
              )}

              {(endpoint.headers as object) && (
                <div className="mb-5">
                  <p className="font-bold">Headers:</p>
                  <pre className=" p-2 rounded">
                    {JSON.stringify(endpoint.headers, null, 2)}
                  </pre>
                </div>
              )}

              {endpoint.queryParams.length > 0 && (
                <div className="mb-5">
                  <p className="font-bold mb-2">Query Parameters:</p>
                  <ul className="list-disc list-inside">
                    {endpoint.queryParams.map((param) => (
                      <li key={param.name}>
                        <span className="font-mono">{param.name}</span> (
                        {param.type}) {param.required ? "(required)" : ""}
                        <div className="text-gray-400">{param.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {endpoint.path.length > 0 && (
                <div className="mb-5">
                  <p className="font-bold mb-2">Path Parameters:</p>
                  <ul className="list-disc list-inside">
                    {endpoint.pathParams.map((param) => (
                      <li key={param.name}>
                        <span className="font-mono">{param.name}</span> (
                        {param.type}) {param.required ? "(required)" : ""}
                        <div className="text-gray-600">{param.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-5">
                {endpoint.request && (
                  <Card>
                    <CardContent className="overflow-auto">
                      <p className="my-4 font-bold text-2xl">Request Body</p>
                      <pre>{JSON.stringify(endpoint.request, null, 2)}</pre>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="overflow-auto">
                    <p className="my-4 font-bold text-2xl">Responses</p>

                    {endpoint.responses.map((response) => (
                      <div key={response.status} className="mb-4">
                        <p className="font-semibold">
                          Status: {response.status}
                        </p>
                        <p className="text-gray-600">{response.description}</p>
                        {(response.example as object) && (
                          <pre className=" p-2 rounded">
                            {JSON.stringify(response.example, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Page;
