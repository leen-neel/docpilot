import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function POST(req: NextRequest) {
  const buffer = await req.arrayBuffer(); // Reads raw bytes
  const data = await pdfParse(Buffer.from(buffer));

  console.log(data);

  return NextResponse.json({ text: data.text });
}
