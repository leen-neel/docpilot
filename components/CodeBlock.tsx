"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { Loader2 } from "lucide-react";

interface Props {
  children: string;
  lang: BundledLanguage;
}

function CodeBlock({ children, lang }: Props) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchHtml() {
      setLoading(true);
      const out = await codeToHtml(children, {
        lang,
        theme: "material-theme-palenight",
      });
      setHtml(out);
      setLoading(false);
    }

    fetchHtml();
  }, [children, lang]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative bg-[#292D3E] rounded-xl overflow-hidden shadow-lg group">
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 z-10 bg-[#1E222F] text-white text-xs px-2 py-1 rounded flex items-center gap-1 hover:bg-[#3E4451] transition"
        title="Copy code"
      >
        {copied ? (
          <>
            <Check size={16} className="text-green-400" />
            Copied!
          </>
        ) : (
          <>
            <Copy size={16} />
            Copy
          </>
        )}
      </button>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-white" size={24} />
        </div>
      ) : (
        <div
          className="w-full overflow-auto text-sm leading-relaxed p-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}

export default CodeBlock;
