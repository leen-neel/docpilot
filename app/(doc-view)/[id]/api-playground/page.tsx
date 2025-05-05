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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Play, Server, Code, ListFilter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

function Page() {
  const doc = useDoc();
  const [selectedServer, setSelectedServer] = useState(
    doc?.servers[0]?.url || ""
  );
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null
  );

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
    setSelectedEndpoint(endpoint);

    try {
      // Convert headers array to object
      const headerObject = headers.reduce((acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch(`${selectedServer}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
          ...headerObject,
        },
        body: body ? JSON.stringify(JSON.parse(body)) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setResponse(data);
      toast.success("Request successful!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          API Playground
        </h1>
        <p className="text-lg text-muted-foreground">
          Test your API endpoints with different servers and configurations
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Server Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Server</Label>
                <Select
                  value={selectedServer}
                  onValueChange={setSelectedServer}
                >
                  <SelectTrigger>
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
          </CardContent>
        </Card>

        {doc?.endpoints.map((endpoint) => (
          <Card key={endpoint.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded text-sm font-mono bg-primary/10 text-primary">
                    {endpoint.method}
                  </span>
                  <span className="font-mono">{endpoint.path}</span>
                </div>
                <Button
                  onClick={() => handleTestEndpoint(endpoint as Endpoint)}
                  disabled={loading}
                >
                  {loading && selectedEndpoint?.id === endpoint.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Test Endpoint
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="headers">
                <TabsList>
                  <TabsTrigger value="headers">
                    <ListFilter className="w-4 h-4 mr-2" />
                    Headers
                  </TabsTrigger>
                  <TabsTrigger value="body">
                    <Code className="w-4 h-4 mr-2" />
                    Body
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="headers" className="space-y-4">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Header key"
                        value={header.key}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleHeaderChange(index, "key", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Header value"
                        value={header.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleHeaderChange(index, "value", e.target.value)
                        }
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveHeader(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddHeader}>
                    Add Header
                  </Button>
                </TabsContent>
                <TabsContent value="body">
                  <Textarea
                    placeholder="Enter request body (JSON)"
                    value={body}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setBody(e.target.value)
                    }
                    className="font-mono"
                    rows={10}
                  />
                </TabsContent>
              </Tabs>

              {error && selectedEndpoint?.id === endpoint.id && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive">
                  {error}
                </div>
              )}

              {response && selectedEndpoint?.id === endpoint.id && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Response</h3>
                  <pre className="p-4 rounded-lg bg-muted overflow-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Page;
