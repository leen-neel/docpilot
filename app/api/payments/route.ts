import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { dodoClient } from "@/lib/dodopayments";
import { CountryCode } from "dodopayments/resources/misc.mjs";

interface ISubscription {
  country: CountryCode;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  name: string;
  email: string;
  plan: "takeoff" | "cruise";
}

const products = {
  takeoff: "pdt_HA0kgAFGBgeoDThQD1au1",
  cruise: "pdt_gzU3M1DU5Ym5ZcHC6SCYI",
};

export async function POST(req: NextRequest) {
  const body: ISubscription = await req.json();
  const userId = await getCurrentUser();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const subscription = await dodoClient.subscriptions.create({
    billing: {
      city: body.city,
      country: body.country,
      state: body.state,
      street: body.address,
      zipcode: body.zipcode,
    },
    metadata: {
      uid: userId,
    },
    customer: {
      email: body.email,
      name: body.name,
      create_new_customer: true,
    },
    product_id: products[body.plan],
    payment_link: true,
    return_url: "http://localhost:3000/",
    quantity: 1,
  });

  return NextResponse.json({ url: subscription.payment_link });
}
