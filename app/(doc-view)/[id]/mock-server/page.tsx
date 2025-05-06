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
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Send } from "lucide-react";

type NetworkCondition = "stable" | "unstable";
type ResponseScenario = "success" | "error" | "timeout" | "throttling";

export default function Page() {
  const doc = useDoc();
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [response, setResponse] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkCondition, setNetworkCondition] =
    useState<NetworkCondition>("stable");
  const [responseScenario, setResponseScenario] =
    useState<ResponseScenario>("success");

  const getEndpoint = (id: string) =>
    doc?.endpoints.find((endpoint) => endpoint.id === id);

  const simulateNetworkDelay = async () => {
    if (networkCondition === "unstable") {
      // Random delay between 1-3 seconds for unstable network
      const delay = Math.random() * 2000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  const handleSendRequest = async () => {
    if (!selectedEndpoint) {
      toast.error("Please select an endpoint first");
      return;
    }

    const endpoint = getEndpoint(selectedEndpoint);
    if (!endpoint) return;

    setIsLoading(true);
    try {
      // Simulate network delay based on condition
      await simulateNetworkDelay();

      // Handle different response scenarios
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
      setResponse({ error: (error as Error).message });
      toast.error((error as Error).message);
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
    )}&method=${encodeURIComponent(
      endpoint.method
    )}&networkCondition=${networkCondition}&responseScenario=${responseScenario}" \\
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
            <Select
              value={selectedEndpoint}
              onValueChange={setSelectedEndpoint}
            >
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Network Condition:
                </p>
                <Select
                  value={networkCondition}
                  onValueChange={(value: NetworkCondition) =>
                    setNetworkCondition(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select network condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stable">Stable Network</SelectItem>
                    <SelectItem value="unstable">Unstable Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Response Scenario:
                </p>
                <Select
                  value={responseScenario}
                  onValueChange={(value: ResponseScenario) =>
                    setResponseScenario(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">401 Unauthorized</SelectItem>
                    <SelectItem value="timeout">Timeout</SelectItem>
                    <SelectItem value="throttling">Throttling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
