"use client";

import * as React from "react";
import { useDoc } from "@/app/context/DocContext";
import CodeBlock from "@/components/CodeBlock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Copy,
  Send,
  Wifi,
  WifiOff,
  Zap,
  AlertTriangle,
  Clock,
  Gauge,
  Plus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type NetworkCondition = "stable" | "unstable";
type ResponseScenario = "success" | "error" | "timeout" | "throttling";
type Header = { key: string; value: string };
type PathParam = { name: string; value: string };

const scenarioIcons = {
  success: Zap,
  error: AlertTriangle,
  timeout: Clock,
  throttling: Gauge,
};

export default function Page() {
  const doc = useDoc();
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [response, setResponse] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkCondition, setNetworkCondition] =
    useState<NetworkCondition>("stable");
  const [responseScenario, setResponseScenario] =
    useState<ResponseScenario>("success");
  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [pathParams, setPathParams] = useState<PathParam[]>([]);

  const getEndpoint = (id: string) =>
    doc?.endpoints.find((endpoint) => endpoint.id === id);

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: keyof Header, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };

  const simulateNetworkDelay = async () => {
    if (networkCondition === "unstable") {
      const delay = Math.random() * 2000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  const updatePathParams = (endpointId: string) => {
    const endpoint = getEndpoint(endpointId);
    if (!endpoint) return;

    const paramRegex = /{([^}]+)}/g;
    const matches = endpoint.path.matchAll(paramRegex);
    const params: PathParam[] = [];

    for (const match of matches) {
      params.push({ name: match[1], value: "" });
    }

    setPathParams(params);
  };

  const updatePathParam = (name: string, value: string) => {
    setPathParams((params) =>
      params.map((param) => (param.name === name ? { ...param, value } : param))
    );
  };

  const getResolvedPath = (path: string) => {
    let resolvedPath = path;
    pathParams.forEach(({ name, value }) => {
      resolvedPath = resolvedPath.replace(`{${name}}`, value);
    });
    return resolvedPath;
  };

  const handleEndpointChange = (value: string) => {
    setSelectedEndpoint(value);
    updatePathParams(value);
  };

  const handleSendRequest = async () => {
    if (!selectedEndpoint) {
      toast.error("Please select an endpoint first");
      return;
    }

    const endpoint = getEndpoint(selectedEndpoint);
    if (!endpoint) return;

    const missingParams = pathParams.filter((param) => !param.value);
    if (missingParams.length > 0) {
      toast.error(
        `Missing required path parameters: ${missingParams
          .map((p) => p.name)
          .join(", ")}`
      );
      return;
    }

    setIsLoading(true);
    try {
      await simulateNetworkDelay();

      switch (responseScenario) {
        case "timeout":
          throw new Error("Request timed out");
        case "error":
          throw new Error("401 Unauthorized");
        case "throttling":
          if (Math.random() > 0.5) {
            throw new Error("429 Too Many Requests");
          }
          break;
      }

      const headerObject = headers.reduce((acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const resolvedPath = getResolvedPath(endpoint.path);
      const response = await fetch(
        `/api/mock/${doc?.id}?path=${encodeURIComponent(
          resolvedPath
        )}&method=${encodeURIComponent(endpoint.method)}`,
        {
          method: "GET",
          headers: headerObject,
        }
      );

      const data = await response.json();
      setResponse(data);
      toast.success("Request successful!");
    } catch (error) {
      setResponse({ error: (error as Error).message });
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRequest = () => {
    const endpoint = getEndpoint(selectedEndpoint);
    if (!endpoint) return;

    const baseUrl = window.location.origin;
    const resolvedPath = getResolvedPath(endpoint.path);
    const path = encodeURIComponent(resolvedPath);
    const method = encodeURIComponent(endpoint.method);
    const network = encodeURIComponent(networkCondition);
    const scenario = encodeURIComponent(responseScenario);

    const headerArgs = headers
      .filter(({ key, value }) => key && value)
      .map(({ key, value }) => `-H "${key}: ${value}"`)
      .join(" ");

    const curlCommand = `curl -X ${endpoint.method.toUpperCase()} "${baseUrl}/api/mock/${
      doc?.id
    }?path=${path}&method=${method}&networkCondition=${network}&responseScenario=${scenario}" ${headerArgs}`;

    navigator.clipboard.writeText(curlCommand);
    toast.success("CURL command copied to clipboard!");
  };

  return (
    <main className="min-h-screen px-6 py-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Mock Server
          </h1>
          <p className="text-lg text-muted-foreground/80">
            Test your API endpoints with simulated network conditions and
            response scenarios
          </p>
        </div>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-xl">Endpoint Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Select Endpoint
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Select
                    value={selectedEndpoint}
                    onValueChange={handleEndpointChange}
                  >
                    <SelectTrigger className="w-full h-10 min-h-0">
                      <SelectValue placeholder="Choose an endpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      {doc?.endpoints.map((endpoint) => (
                        <SelectItem key={endpoint.id} value={endpoint.id}>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-mono",
                                endpoint.method === "GET" &&
                                  "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                endpoint.method === "POST" &&
                                  "bg-green-500/10 text-green-500 border-green-500/20",
                                endpoint.method === "PUT" &&
                                  "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                endpoint.method === "DELETE" &&
                                  "bg-red-500/10 text-red-500 border-red-500/20"
                              )}
                            >
                              {endpoint.method}
                            </Badge>
                            <span className="font-mono">{endpoint.path}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCopyRequest}
                  disabled={!selectedEndpoint}
                  className="h-10 flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy CURL
                </Button>
              </div>
            </div>

            {selectedEndpoint && pathParams.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Path Parameters
                </p>
                <div className="space-y-2">
                  {pathParams.map((param) => (
                    <div key={param.name} className="flex items-center gap-2">
                      <div className="w-32 text-sm font-mono text-muted-foreground">
                        {param.name}
                      </div>
                      <Input
                        placeholder={`Enter ${param.name}`}
                        value={param.value}
                        onChange={(e) =>
                          updatePathParam(param.name, e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEndpoint && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Network Condition
                  </p>
                  <Select
                    value={networkCondition}
                    onValueChange={(value: NetworkCondition) =>
                      setNetworkCondition(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {networkCondition === "stable" ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-red-500" />
                          )}
                          <span>
                            {networkCondition === "stable"
                              ? "Stable"
                              : "Unstable"}{" "}
                            Network
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-green-500" />
                          <span>Stable Network</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="unstable">
                        <div className="flex items-center gap-2">
                          <WifiOff className="w-4 h-4 text-red-500" />
                          <span>Unstable Network</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Response Scenario
                  </p>
                  <Select
                    value={responseScenario}
                    onValueChange={(value: ResponseScenario) =>
                      setResponseScenario(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {React.createElement(
                            scenarioIcons[responseScenario],
                            {
                              className: "w-4 h-4",
                            }
                          )}
                          <span className="capitalize">{responseScenario}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-green-500" />
                          <span>Success</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="error">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span>401 Unauthorized</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="timeout">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span>Timeout</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="throttling">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-orange-500" />
                          <span>Throttling</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedEndpoint && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Request Headers
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addHeader}
                    className="h-8"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Header
                  </Button>
                </div>
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Header name"
                        value={header.key}
                        onChange={(e) =>
                          updateHeader(index, "key", e.target.value)
                        }
                        className="h-8"
                      />
                      <Input
                        placeholder="Header value"
                        value={header.value}
                        onChange={(e) =>
                          updateHeader(index, "value", e.target.value)
                        }
                        className="h-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHeader(index)}
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedEndpoint && (
          <div className="grid gap-6">
            <Card className="border-border/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">Request</CardTitle>
                <Button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <CodeBlock lang="json">
                    {JSON.stringify(
                      getEndpoint(selectedEndpoint)?.request?.[0]?.example ??
                        {},
                      null,
                      2
                    )}
                  </CodeBlock>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 overflow-x-auto">
              <CardHeader>
                <CardTitle className="text-xl">Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/50 p-4">
                  {response ? (
                    <CodeBlock lang="json">
                      {JSON.stringify(response, null, 2)}
                    </CodeBlock>
                  ) : (
                    <p className="text-muted-foreground">
                      Send a request to see the response
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
