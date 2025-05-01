"use client";

import { useDoc } from "@/app/context/DocContext";
import CodeHighlighter from "@/components/CodeBlock";
import type { BundledLanguage } from "shiki";

function Page() {
  const doc = useDoc();
  const sdks = doc?.sdkWrappers;

  return (
    <>
      {sdks?.map((sdk) => (
        <div key={sdk.id}>
          <h2 className="text-2xl font-bold mb-4">{sdk.language}</h2>

          <CodeHighlighter lang={sdk.language.toLowerCase() as BundledLanguage}>
            {sdk.code.join("\n")}
          </CodeHighlighter>
        </div>
      ))}
    </>
  );
}

export default Page;
