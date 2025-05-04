"use client";

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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Send } from "lucide-react";

export default function Page() {
  const doc = useDoc();
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getEndpoint = (id: string) =>
    doc?.endpoints.find((endpoint) => endpoint.id === id);

  const handleSendRequest = async () => {
    if (!selectedEndpoint) {
      toast.error("Please select an endpoint first");
      return;
    }

    const endpoint = getEndpoint(selectedEndpoint);
    if (!endpoint) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/mock/${doc?.id}?path=${encodeURIComponent(
          endpoint.path
        )}&method=${encodeURIComponent(endpoint.method)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const data = await response.json();
      
      setResponse(data);
      toast.success("Request successful!");
    } catch (error) {
      toast.error("Failed to send request");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRequest = () => {
    const endpoint = getEndpoint(selectedEndpoint);
    if (!endpoint) return;

    const curlCommand = `curl -X ${endpoint.method.toUpperCase()} \\
  "${window.location.origin}/api/mock/${doc?.id}?path=${encodeURIComponent(
      endpoint.path
    )}&method=${encodeURIComponent(endpoint.method)}" \\
  -H "Content-Type: application/json"`;

    navigator.clipboard.writeText(curlCommand);
    toast.success("CURL command copied to clipboard!");
  };

  return (
    <main className="min-h-screen px-6 py-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Select Endpoint:
            </p>
            <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Choose an endpoint" />
              </SelectTrigger>
              <SelectContent>
                {doc?.endpoints.map((endpoint) => (
                  <SelectItem key={endpoint.id} value={endpoint.id}>
                    {endpoint.method.toUpperCase()} {endpoint.path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="ml-4"
            onClick={handleCopyRequest}
            disabled={!selectedEndpoint}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy CURL
          </Button>
        </div>

        {selectedEndpoint && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Request:</h3>
                <Button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="flex items-center"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-md border bg-muted p-4">
                <CodeBlock lang="json">
                  {JSON.stringify(
                    getEndpoint(selectedEndpoint)?.request?.[0]?.example ?? {},
                    null,
                    2
                  )}
                </CodeBlock>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Response:</h3>
              <div className="rounded-md border bg-muted p-4">
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
            </div>
          </>
        )}
      </div>
    </main>
  );
}
