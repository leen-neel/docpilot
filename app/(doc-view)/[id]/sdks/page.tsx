"use client";

import { useDoc } from "@/app/context/DocContext";
import CodeHighlighter from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BundledLanguage } from "shiki";

function Page() {
  const doc = useDoc();
  const sdks = doc?.sdkWrappers;

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          SDKs & Libraries
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose your preferred programming language and start integrating with
          our API
        </p>
      </div>

      <div className="grid gap-6">
        {sdks?.map((sdk) => (
          <Card
            key={sdk.id}
            className="border rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="text-sm font-mono capitalize"
                  >
                    {sdk.language}
                  </Badge>
                  <span className="text-xl">SDK</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CodeHighlighter
                lang={sdk.language.toLowerCase() as BundledLanguage}
              >
                {sdk.code!.join("\n")}
              </CodeHighlighter>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Page;
