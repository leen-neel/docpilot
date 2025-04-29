import CodeBlock from "@/components/CodeBlock";
import { getDocs } from "@/lib/actions/db.actions";

async function Page({ params }: RouteParams) {
  const { id } = await params;

  const doc = await getDocs();
  const sdk = doc?.sdkWrappers;

  return (
    <>
      {sdk && sdk[0]?.code ? (
        <CodeBlock lang="ts">{sdk[0].code.join("\n")}</CodeBlock>
      ) : (
        <p>No SDK code available</p>
      )}
    </>
  );
}

export default Page;
