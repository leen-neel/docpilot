import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMockResponse } from "@/lib/actions/db.actions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    const method = searchParams.get("method");

    if (!path || !method) {
      return NextResponse.json(
        { error: "Path and method are required" },
        { status: 400 }
      );
    }

    const resolvedParams = await params;
    const { data, status } = await getMockResponse(resolvedParams.id, path, method);

    if (status === 204) {
      return new NextResponse(null, { 
        status: 204,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("Mock server error:", error);
    if (error instanceof Error) {
      if (error.message === "Endpoint not found") {
        return NextResponse.json(
          { error: "Endpoint not found" },
          { status: 404 }
        );
      }
      if (error.message === "No response example found") {
        return NextResponse.json(
          { error: "No response example found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 