import { generateDocs } from "@/lib/actions/general.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const generatedDoc = await generateDocs("typescript", body);

  console.log(generatedDoc);

  return NextResponse.json({ message: "ok" });
}
