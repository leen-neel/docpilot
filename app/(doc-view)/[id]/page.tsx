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
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const apiDoc = useDoc();
  const router = useRouter();
  const [selectedServer, setSelectedServer] = useState(apiDoc?.servers[0].url);

  return (
    <>
      {/* Main Section */}
      <section className="px-5 max-w-7xl mx-auto">
        <div className="flex justify-between flex-col-reverse md:flex-row items-start gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {apiDoc?.name}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {apiDoc?.description}
            </p>
          </div>

          {/* Server Selector */}
          <div className="w-full md:w-auto">
            <Popover>
              <PopoverTrigger className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto">
                  <span className="text-muted-foreground mr-2">Server:</span>
                  <span className="font-medium">{selectedServer}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-2">
                {apiDoc?.servers.map((server) => (
                  <Button
                    key={server.url}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedServer(server.url)}
                  >
                    {selectedServer === server.url && (
                      <Check className="text-primary mr-2 h-4 w-4" />
                    )}
                    <div className="text-left">
                      <div className="font-medium">{server.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {server.url}
                      </div>
                    </div>
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col gap-8 mt-12">
          {apiDoc?.endpoints.map((endpoint) => (
            <div
              id={`${endpoint.method.toLowerCase()}-${endpoint.path}`}
              key={endpoint.id}
              className="border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-card"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      endpoint.method === "GET"
                        ? "default"
                        : endpoint.method === "POST"
                        ? "secondary"
                        : endpoint.method === "PUT"
                        ? "outline"
                        : endpoint.method === "DELETE"
                        ? "destructive"
                        : "default"
                    }
                    className="text-sm font-mono"
                  >
                    {endpoint.method}
                  </Badge>
                  <h3 className="text-xl font-mono">{endpoint.path}</h3>

                  <p> {endpoint.cateogry} </p>
                </div>

                <p className="text-muted-foreground">{endpoint.description}</p>

                {endpoint.security && (
                  <div className="space-y-2">
                    <p className="font-semibold">Security</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm">
                        {String(endpoint?.security)}
                      </pre>
                    </div>
                  </div>
                )}

                {typeof endpoint.headers === "object" && endpoint.headers && (
                  <div className="space-y-2">
                    <p className="font-semibold">Headers</p>
                    <CodeBlock lang="json">
                      {JSON.stringify(endpoint.headers, null, 2)}
                    </CodeBlock>
                  </div>
                )}

                {endpoint.queryParams!.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold">Query Parameters</p>
                    <div className="grid gap-2">
                      {endpoint.queryParams!.map((param) => (
                        <div
                          key={param.name}
                          className="bg-muted p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{param.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {param.type}
                            </Badge>
                            {param.required && (
                              <Badge variant="secondary" className="text-xs">
                                required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {endpoint.pathParams!.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold">Path Parameters</p>
                    <div className="grid gap-2">
                      {endpoint.pathParams!.map((param) => (
                        <div
                          key={param.name}
                          className="bg-muted p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{param.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {param.type}
                            </Badge>
                            {param.required && (
                              <Badge variant="secondary" className="text-xs">
                                required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {endpoint.request!.length > 0 && (
                    <Card className="border-0 bg-muted/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-semibold text-lg">Request Body</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() =>
                              router.push(
                                `/${apiDoc?.id}/api-console?endpoint=${endpoint.id}`
                              )
                            }
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Try it
                          </Button>
                        </div>

                        {endpoint.request!.map((req) => (
                          <div key={req.id} className="space-y-3">
                            <p className="text-muted-foreground">
                              {req.description}
                            </p>

                            {(req.example as object) && (
                              <CodeBlock lang="json">
                                {JSON.stringify(req.example, null, 2)}
                              </CodeBlock>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {endpoint.responses!.length > 0 && (
                    <Card className="border-0 bg-muted/50">
                      <CardContent className="p-6">
                        <p className="font-semibold text-lg mb-4">Responses</p>

                        {endpoint.responses!.map((response) => (
                          <div key={response.status} className="space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  String(response.status).startsWith("2")
                                    ? "default"
                                    : String(response.status).startsWith("4")
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {response.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                {response.description}
                              </p>
                            </div>

                            {Object.keys(response.example as object).length >
                              0 && (
                              <CodeBlock lang="json">
                                {JSON.stringify(response.example, null, 2)}
                              </CodeBlock>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Page;
