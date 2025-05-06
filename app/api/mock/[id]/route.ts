import { NextRequest, NextResponse } from "next/server";
import { getMockResponse } from "@/lib/actions/db.actions";

type NetworkCondition = "stable" | "unstable";
type ResponseScenario = "success" | "error" | "timeout" | "throttling";

const simulateNetworkDelay = async (condition: NetworkCondition) => {
  if (condition === "unstable") {
    const delay = Math.random() * 2000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

const handleResponseScenario = async (scenario: ResponseScenario) => {
  switch (scenario) {
    case "timeout":
      throw new Error("Request timed out");
    case "error":
      throw new Error("401 Unauthorized");
    case "throttling":
      if (Math.random() > 0.5) {
        throw new Error("429 Too Many Requests");
      }
      break;
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    const method = searchParams.get("method");
    const networkCondition = (searchParams.get("networkCondition") ||
      "stable") as NetworkCondition;
    const responseScenario = (searchParams.get("responseScenario") ||
      "success") as ResponseScenario;

    if (!path || !method) {
      return NextResponse.json(
        { error: "Path and method are required" },
        { status: 400 }
      );
    }

    // Simulate network delay based on condition
    await simulateNetworkDelay(networkCondition);

    // Handle response scenario
    await handleResponseScenario(responseScenario);

    const resolvedParams = await params;
    const { data, status } = await getMockResponse(
      resolvedParams.id,
      path,
      method
    );

    if (status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return NextResponse.json(data, { status });
  } catch (error) {
    // Only log actual errors, not simulated scenarios
    if (error instanceof Error) {
      const isSimulatedError = [
        "401 Unauthorized",
        "429 Too Many Requests",
        "Request timed out",
      ].includes(error.message);

      if (!isSimulatedError) {
        console.error("Mock server error:", error);
      }

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
      if (error.message === "401 Unauthorized") {
        return NextResponse.json(
          { error: "401 Unauthorized" },
          { status: 401 }
        );
      }
      if (error.message === "429 Too Many Requests") {
        return NextResponse.json(
          { error: "429 Too Many Requests" },
          { status: 429 }
        );
      }
      if (error.message === "Request timed out") {
        return NextResponse.json(
          { error: "Request timed out" },
          { status: 408 }
        );
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
