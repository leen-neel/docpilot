import { NextRequest, NextResponse } from "next/server";
import { Webhook, WebhookUnbrandedRequiredHeaders } from "standardwebhooks";

interface WebhookEvent {
  type: string;
  data: {
    metadata: {
      uid: string;
    };
  };
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const rawBody = JSON.stringify(body);

  const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!);
  const webhookHeaders: WebhookUnbrandedRequiredHeaders = {
    "webhook-id": req.headers.get("webhook-id") || "",
    "webhook-signature": req.headers.get("webhook-signature") || "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") || "",
  };

  try {
    const verified = (await webhook.verify(
      rawBody,
      webhookHeaders
    )) as WebhookEvent;

    switch (verified.type) {
      case "subscription.active":
        console.log(verified.data.metadata.uid);
        break;
      default:
        console.log("Unknown event type");
        break;
    }

    return NextResponse.json({ message: "successful" });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 }
    );
  }
};
