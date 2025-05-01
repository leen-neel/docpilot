"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

interface Props {
  children: string;
  lang: BundledLanguage;
}

function CodeBlock(props: Props) {
  const [html, sethtml] = useState<string | TrustedHTML>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchHtml() {
      const out = await codeToHtml(props.children, {
        lang: props.lang,
        theme: "material-theme-palenight",
      });

      sethtml(out);
    }

    fetchHtml();
  }, [props.children, props.lang]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative code-block">
      <button
        onClick={copyToClipboard}
        className="mb-5 bg-gray-700 text-white text-sm px-2 py-1 rounded hover:bg-gray-600 transition"
      >
        {!copied ? <Copy /> : <Check />}
      </button>
      <div
        className="w-full overflow-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default CodeBlock;
