import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

interface Props {
  children: string;
  lang: BundledLanguage;
}

async function CodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: "material-theme-palenight",
  });

  return (
    <div className="code-block">
      <div dangerouslySetInnerHTML={{ __html: out }} />
    </div>
  );
}

export default CodeBlock;
