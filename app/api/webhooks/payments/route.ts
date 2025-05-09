import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (body.type === "subscription.active") {
    console.log(body);
  }

  return NextResponse.json({ message: "successful" });
};
