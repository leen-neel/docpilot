"use client";

import { useDoc } from "@/app/context/DocContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Globe,
  Zap,
  Code,
  ListFilter,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

interface Header {
  key: string;
  value: string;
}

interface Endpoint {
  id: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  pathParams?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
}

function Page() {
  const doc = useDoc();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedServer, setSelectedServer] = useState(
    doc?.servers[0]?.url || ""
  );
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null
  );
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [pathParamValues, setPathParamValues] = useState<
    Record<string, string>
  >({});
  const [editingParam, setEditingParam] = useState<string | null>(null);

  // Set initial endpoint from URL parameter
  useEffect(() => {
    const endpointId = searchParams.get("endpoint");
    if (endpointId && doc?.endpoints) {
      const endpoint = doc.endpoints.find((ep) => ep.id === endpointId);
      if (endpoint) {
        setSelectedEndpoint(endpoint as Endpoint);
      }
    }
  }, [searchParams, doc?.endpoints]);

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleHeaderChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleTestEndpoint = async (endpoint: Endpoint) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);
    setSelectedEndpoint(endpoint);

    const startTime = performance.now();

    try {
      const headerObject = headers.reduce((acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      // Replace path parameters in the URL
      let finalPath = endpoint.path;
      if (endpoint.pathParams) {
        for (const param of endpoint.pathParams) {
          const value = pathParamValues[param.name];
          if (param.required && !value) {
            throw new Error(`Missing required path parameter: ${param.name}`);
          }
          if (value) {
            finalPath = finalPath.replace(`{${param.name}}`, value);
          }
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${selectedServer}${finalPath}`, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
          ...headerObject,
        },
        body: body ? JSON.stringify(JSON.parse(body)) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      console.log(data);

      const endTime = performance.now();

      setResponseTime(endTime - startTime);

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setResponse(data);
      toast.success("Request successful!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";

      if (err instanceof Error && err.name === "AbortError") {
        toast.error("Request timed out");
        router.push("/");
        return;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      POST: "bg-green-500/10 text-green-500 border-green-500/20",
      PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
      PATCH: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return (
      colors[method as keyof typeof colors] ||
      "bg-gray-500/10 text-gray-500 border-gray-500/20"
    );
  };

  // Function to render the path with editable parameters
  const renderPath = (path: string) => {
    if (!selectedEndpoint?.pathParams) return path;

    const parts = path.split(/(\{[^}]+\})/);
    return parts.map((part, index) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        const paramName = part.slice(1, -1);
        const param = selectedEndpoint.pathParams?.find(
          (p) => p.name === paramName
        );
        const value = pathParamValues[paramName] || "";

        if (editingParam === paramName) {
          return (
            <Input
              key={index}
              value={value}
              onChange={(e) => {
                setPathParamValues({
                  ...pathParamValues,
                  [paramName]: e.target.value,
                });
              }}
              onBlur={() => setEditingParam(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingParam(null);
                }
              }}
              placeholder={paramName}
              className="inline-block w-32 h-6 px-2 py-1 text-sm bg-background/50 border-primary/50 focus:border-primary"
              autoFocus
            />
          );
        }

        return (
          <span
            key={index}
            onClick={() => setEditingParam(paramName)}
            className={cn(
              "inline-block px-2 py-0.5 rounded cursor-pointer transition-colors",
              value
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-muted text-muted-foreground border border-border hover:bg-accent"
            )}
            title={param?.description || `Click to edit ${paramName}`}
          >
            {value || paramName}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Header */}
      <div className="flex-none p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                API Console
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Test and debug your API endpoints in real-time
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
                <Globe className="w-4 h-4 text-primary" />
                <Select
                  value={selectedServer}
                  onValueChange={setSelectedServer}
                >
                  <SelectTrigger className="w-[300px] border-0 bg-transparent">
                    <SelectValue placeholder="Select a server" />
                  </SelectTrigger>
                  <SelectContent>
                    {doc?.servers.map((server) => (
                      <SelectItem key={server.url} value={server.url}>
                        {server.url}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full grid grid-cols-12 gap-6">
          {/* Endpoints List */}
          <div className="col-span-3 h-full">
            <Card className="h-full border-0 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="border-b bg-card/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-4 h-4 text-primary" />
                  Endpoints
                </CardTitle>
              </CardHeader>
              <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="p-4 space-y-2">
                  {doc?.endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setSelectedEndpoint(endpoint as Endpoint)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all duration-200",
                        selectedEndpoint?.id === endpoint.id
                          ? "bg-primary/10 border border-primary/20 shadow-sm"
                          : "hover:bg-accent/50 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            getMethodColor(endpoint.method),
                            "border"
                          )}
                        >
                          {endpoint.method}
                        </Badge>
                        <span className="font-mono text-sm truncate">
                          {endpoint.path}
                        </span>
                      </div>
                      {endpoint.summary && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {endpoint.summary}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Request/Response Panel */}
          <div className="col-span-9 h-full">
            <Card className="h-full border-0 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="border-b bg-card/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {selectedEndpoint && (
                      <>
                        <Badge
                          variant="secondary"
                          className={cn(
                            getMethodColor(selectedEndpoint.method),
                            "border"
                          )}
                        >
                          {selectedEndpoint.method}
                        </Badge>
                        <span className="font-mono text-lg flex items-center gap-1">
                          {renderPath(selectedEndpoint.path)}
                        </span>
                      </>
                    )}
                  </CardTitle>
                  {selectedEndpoint && (
                    <Button
                      onClick={() => handleTestEndpoint(selectedEndpoint)}
                      disabled={loading}
                      className="bg-primary hover:bg-primary/90 shadow-sm"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Send Request
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {selectedEndpoint ? (
                  <div>
                    <Tabs defaultValue="headers" className="h-full">
                      <div className="border-b px-6 bg-card/50">
                        <TabsList className="bg-transparent">
                          <TabsTrigger
                            value="headers"
                            className="data-[state=active]:bg-primary/10"
                          >
                            <ListFilter className="w-4 h-4 mr-2" />
                            Headers
                          </TabsTrigger>
                          <TabsTrigger
                            value="body"
                            className="data-[state=active]:bg-primary/10"
                          >
                            <Code className="w-4 h-4 mr-2" />
                            Body
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <div className="p-6">
                        <TabsContent value="headers" className="space-y-4 mt-0">
                          {headers.map((header, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder="Header key"
                                value={header.key}
                                onChange={(e) =>
                                  handleHeaderChange(
                                    index,
                                    "key",
                                    e.target.value
                                  )
                                }
                                className="bg-background/50"
                              />
                              <Input
                                placeholder="Header value"
                                value={header.value}
                                onChange={(e) =>
                                  handleHeaderChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                                className="bg-background/50"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemoveHeader(index)}
                                className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={handleAddHeader}
                            className="border-primary/20 text-primary hover:bg-primary/10"
                          >
                            Add Header
                          </Button>
                        </TabsContent>
                        <TabsContent value="body" className="mt-0">
                          <Textarea
                            placeholder="Enter request body (JSON)"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="font-mono h-[200px] bg-background/50"
                          />
                        </TabsContent>
                      </div>
                    </Tabs>

                    {(error || response) && (
                      <div className="border-t p-6 bg-card/50 mt-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-primary" />
                            <h3 className="text-lg font-semibold">Response</h3>
                          </div>
                          {responseTime && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {responseTime.toFixed(0)}ms
                            </div>
                          )}
                        </div>
                        {error && (
                          <div className="p-4 rounded-lg bg-destructive/10 text-destructive mb-4 border border-destructive/20">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4" />
                              {error}
                            </div>
                          </div>
                        )}
                        {response && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Success
                              </span>
                            </div>
                            <pre className="p-4 rounded-lg bg-background/50 overflow-auto border border-border">
                              {JSON.stringify(response, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Select an endpoint to start testing
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
