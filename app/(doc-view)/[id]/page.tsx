"use client";

import { useDoc } from "@/app/context/DocContext";
import CodeBlock from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { Check } from "lucide-react";
import { useState } from "react";

function Page() {
  const apiDoc = useDoc();

  const [selectedServer, setSelectedServer] = useState(apiDoc?.servers[0].url);

  return (
    <>
      {/* Main Section */}
      <section className="px-5">
        <div className="flex justify-between flex-col-reverse md:flex-row">
          <div>
            <h2 className="text-4xl font-bold">
              <SidebarTrigger className="mr-5" />

              {apiDoc?.name}
            </h2>
            <p className="mt-2 text-gray-300">{apiDoc?.description}</p>
          </div>

          {/* Server Selector */}
          <div className="mb-5 md:mt-5">
            <Popover>
              <PopoverTrigger className="border p-2 rounded-md">
                Server: {selectedServer}
              </PopoverTrigger>
              <PopoverContent className="max-w-xl">
                {apiDoc?.servers.map((server) => (
                  <Button
                    key={server.url}
                    variant="ghost"
                    className=" justify-start"
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
          </div>
        </div>

        <div className="flex flex-col gap-16 mt-10">
          {apiDoc?.endpoints.map((endpoint) => (
            <div
              id={`${endpoint.method.toLowerCase()}-${endpoint.path}`}
              key={endpoint.id}
              className="border p-5 rounded-lg shadow-md"
            >
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

              {endpoint.headers
                ? (endpoint.headers as object) && (
                    <div className="mb-5">
                      <p className="font-bold">Headers:</p>
                      <pre className=" p-2 rounded">
                        {JSON.stringify(endpoint.headers, null, 2)}
                      </pre>
                    </div>
                  )
                : ""}

              {endpoint.queryParams!.length > 0 && (
                <div className="mb-5">
                  <p className="font-bold mb-2">Query Parameters:</p>
                  <ul className="list-disc list-inside">
                    {endpoint.queryParams!.map((param) => (
                      <li key={param.name}>
                        <span className="font-mono">{param.name}</span> (
                        {param.type}) {param.required ? "(required)" : ""}
                        <div className="text-gray-400">{param.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {endpoint.pathParams!.length > 0 && (
                <div className="mb-5">
                  <p className="font-bold mb-2">Path Parameters:</p>
                  <ul className="list-disc list-inside">
                    {endpoint.pathParams!.map((param) => (
                      <li key={param.name}>
                        <span className="font-mono">{param.name}</span> (
                        {param.type}) {param.required ? "(required)" : ""}
                        <div className="text-gray-400">{param.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-5">
                {endpoint.request!.length > 0 && (
                  <Card>
                    <CardContent className="overflow-auto">
                      <p className="my-4 font-bold text-2xl">Request Body</p>

                      {endpoint.request!.map((req) => (
                        <div key={req.id}>
                          <p className="text-gray-400 mb-3">
                            {req.description}
                          </p>

                          {req.example ? (
                            <CodeBlock lang="json">
                              {JSON.stringify(req.example, null, 2)}
                            </CodeBlock>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {endpoint.responses!.length > 0 && (
                  <Card>
                    <CardContent className="overflow-auto">
                      <p className="my-4 font-bold text-2xl">Responses</p>

                      {endpoint.responses!.map((response) => (
                        <div key={response.status} className="mb-4">
                          <p className="font-semibold">
                            Status: {response.status}
                          </p>
                          <p className="text-gray-400">
                            {response.description}
                          </p>

                          {Object.keys(response.example).length > 0
                            ? (response.example as object) && (
                                <CodeBlock lang="json">
                                  {JSON.stringify(response.example, null, 2)}
                                </CodeBlock>
                              )
                            : ""}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Page;
