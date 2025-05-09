"use client";

import { useDoc } from "@/app/context/DocContext";
import CodeHighlighter from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import type { BundledLanguage } from "shiki";

const languageIcons: Record<string, string> = {
  typescript: "devicon:typescript",
  javascript: "devicon:javascript",
  python: "devicon:python",
  php: "devicon:php",
  perl: "devicon:perl",
  ruby: "devicon:ruby",
  rust: "devicon:rust",
  golang: "devicon:go",
  java: "devicon:java",
};

function Page() {
  const doc = useDoc();
  const sdks = doc?.sdkWrappers;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="space-y-3 mb-12">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          SDK Wrapper
        </h1>
        <p className="text-lg text-muted-foreground/80 max-w-2xl">
          SDK wrapper for the API in your preferred programming language.
        </p>
      </div>

      <div className="grid gap-8">
        {sdks?.map((sdk) => (
          <Card
            key={sdk.id}
            className="group border border-border/40 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Icon
                      icon={languageIcons[sdk.language.toLowerCase()]}
                      className="w-8 h-8 text-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold capitalize">
                      {sdk.language} SDK
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Official SDK wrapper for {sdk.language}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border/40">
                <CodeHighlighter
                  lang={sdk.language.toLowerCase() as BundledLanguage}
                >
                  {sdk.code!.join("\n")}
                </CodeHighlighter>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Page;
