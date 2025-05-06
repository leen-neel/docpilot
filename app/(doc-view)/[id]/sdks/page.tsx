"use client";

import { useDoc } from "@/app/context/DocContext";
import CodeHighlighter from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { BundledLanguage } from "shiki";
import JSZip from "jszip";

function Page() {
  const doc = useDoc();
  const sdks = doc?.sdkWrappers;

  const handleCopyCode = (code: string[]) => {
    navigator.clipboard.writeText(code.join("\n"));
    toast.success("Code copied to clipboard!");
  };

  const createPackageJson = (sdkName: string) => {
    return {
      name: sdkName.toLowerCase().replace(/\s+/g, "-"),
      version: "1.0.0",
      description: `SDK for ${sdkName}`,
      main: "index.js",
      types: "index.d.ts",
      scripts: {
        build: "tsc",
        test: "jest",
      },
      keywords: ["api", "sdk", sdkName.toLowerCase()],
      author: "",
      license: "MIT",
      dependencies: {
        axios: "^1.6.0",
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        typescript: "^5.0.0",
        jest: "^29.0.0",
        "@types/jest": "^29.0.0",
      },
    };
  };

  const createSetupPy = (sdkName: string) => {
    return `from setuptools import setup, find_packages

setup(
    name="${sdkName.toLowerCase().replace(/\s+/g, "-")}",
    version="1.0.0",
    description="SDK for ${sdkName}",
    author="",
    author_email="",
    packages=find_packages(),
    install_requires=[
        "requests>=2.31.0",
    ],
    python_requires=">=3.8",
)`;
  };

  const createPomXml = (sdkName: string) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>${sdkName.toLowerCase().replace(/\s+/g, "-")}</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.squareup.okhttp3</groupId>
            <artifactId>okhttp</artifactId>
            <version>4.11.0</version>
        </dependency>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>
</project>`;
  };

  const createGoMod = (sdkName: string) => {
    return `module github.com/example/${sdkName
      .toLowerCase()
      .replace(/\s+/g, "-")}

go 1.21

require (
    github.com/go-resty/resty/v2 v2.10.0
)`;
  };

  const handleDownloadCode = async (
    code: string[] | null,
    language: string
  ) => {
    const zip = new JSZip();
    const sdkName = doc?.name || "api-sdk";
    const formattedName = sdkName.toLowerCase().replace(/\s+/g, "-");

    // Add the main SDK code
    const mainFile = getMainFileName(language);
    zip.file(mainFile, code!.join("\n"));

    // Add language-specific files
    switch (language.toLowerCase()) {
      case "javascript":
      case "typescript":
        zip.file(
          "package.json",
          JSON.stringify(createPackageJson(sdkName), null, 2)
        );
        zip.file(
          "tsconfig.json",
          JSON.stringify(
            {
              compilerOptions: {
                target: "es2018",
                module: "commonjs",
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
                outDir: "./dist",
                declaration: true,
              },
              include: ["src/**/*"],
              exclude: ["node_modules", "**/*.test.ts"],
            },
            null,
            2
          )
        );
        zip.file(
          "README.md",
          `# ${sdkName} SDK\n\nSDK for interacting with the ${sdkName} API.`
        );
        break;
      case "python":
        zip.file("setup.py", createSetupPy(sdkName));
        zip.file(
          "README.md",
          `# ${sdkName} SDK\n\nSDK for interacting with the ${sdkName} API.`
        );
        break;
      case "java":
        zip.file("pom.xml", createPomXml(sdkName));
        zip.file(
          "README.md",
          `# ${sdkName} SDK\n\nSDK for interacting with the ${sdkName} API.`
        );
        break;
      case "go":
        zip.file("go.mod", createGoMod(sdkName));
        zip.file(
          "README.md",
          `# ${sdkName} SDK\n\nSDK for interacting with the ${sdkName} API.`
        );
        break;
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formattedName}-${language.toLowerCase()}-sdk.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("SDK downloaded successfully!");
  };

  const getMainFileName = (language: string): string => {
    const extensions: Record<string, string> = {
      JavaScript: "src/index.js",
      TypeScript: "src/index.ts",
      Python: `${doc?.name.toLowerCase().replace(/\s+/g, "_")}/__init__.py`,
      Java: "src/main/java/com/example/sdk/Sdk.java",
      Go: "sdk.go",
      Ruby: "lib/sdk.rb",
      PHP: "src/Sdk.php",
      "C#": "Sdk.cs",
      Swift: "Sources/Sdk.swift",
      Kotlin: "src/main/kotlin/com/example/sdk/Sdk.kt",
      Rust: "src/lib.rs",
      Dart: "lib/sdk.dart",
    };
    return extensions[language] || "sdk.txt";
  };

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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyCode(sdk.code!)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleDownloadCode(sdk.code, sdk.language)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border bg-muted/50">
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
