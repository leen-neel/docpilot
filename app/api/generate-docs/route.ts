import { addDoc } from "@/lib/actions/db.actions";
import { generateDocs } from "@/lib/actions/general.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const generatedDoc = await generateDocs("typescript", body);

  await addDoc(generatedDoc, body.user);

  return NextResponse.json({ message: "ok" });
}
