"use client";

import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";

const languageIcons = {
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

const HomePage = () => {
  const [fileContents, setfileContents] = useState("");
  const [loading, setloading] = useState(false);
  const [language, setLanguage] = useState("typescript");

  const { user } = useUser();
  const router = useRouter();

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];

    if (file.type !== "application/pdf") {
      const cont: string = await file.text();
      setfileContents(cont.replace(/[\n\s]+/g, ""));
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    const res = await fetch("/api/parse-pdf", {
      method: "POST",
      body: arrayBuffer,
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    const json = await res.json();
    setfileContents(json.text);
  };

  const handleProcess = async () => {
    setloading(true);

    try {
      await fetch("/api/generate-docs", {
        method: "POST",
        body: JSON.stringify({
          user: user!.id,
          body: fileContents,
          language,
        }),
      });

      toast("Your doc has been created!");
      router.push("/");
    } catch {
      toast("Something went wrong");
      router.push("/");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Your API Documentation</h1>
      <FileUpload onFileUpload={handleFileUpload} />

      <div>
        <p className="text-center my-5">Select SDK Language:</p>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-lg mt-5">
            <SelectValue placeholder="Language">
              {language && (
                <div className="flex items-center gap-2">
                  <Icon
                    icon={languageIcons[language as keyof typeof languageIcons]}
                    width={20}
                    height={20}
                  />
                  <span className="capitalize">{language}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(languageIcons).map(([lang, icon]) => (
              <SelectItem key={lang} value={lang}>
                <div className="flex items-center gap-2">
                  <Icon icon={icon} width={20} height={20} />
                  <span className="capitalize">{lang}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {fileContents !== "" && (
        <div>
          <Button className="mt-5" onClick={handleProcess} disabled={loading}>
            {loading ? <RefreshCcw className="animate-spin" /> : ""}
            {loading ? "Docs are being generated" : "Proceed"}
          </Button>
        </div>
      )}
    </main>
  );
};

export default HomePage;
