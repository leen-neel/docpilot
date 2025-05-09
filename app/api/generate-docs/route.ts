import { addDoc } from "@/lib/actions/db.actions";
import { generateDocs } from "@/lib/actions/general.actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "You're not allowed to do this" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const generatedDoc = await generateDocs(body.language, body.body);

    await addDoc(generatedDoc, body.user);
    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Error" }, { status: 400 });
  }
}
