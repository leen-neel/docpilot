import { createUser, deleteUser } from "@/lib/actions/db.actions";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();
  const type = payload.type;

  if (type === "user.created") {
    const id = payload.data.id;

    await createUser(id);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } else if (type === "user.deleted") {
    const id = payload.data.id;

    await deleteUser(id!);

    return NextResponse.json({ message: "ok" });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
