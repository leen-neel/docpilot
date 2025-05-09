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
}

export async function POST(req: NextRequest) {
  const body: ISubscription = await req.json();
  const userId = await getCurrentUser();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log(body);

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
    product_id: "pdt_HA0kgAFGBgeoDThQD1au1",
    payment_link: true,
    return_url: "http://localhost:3000/",
    quantity: 1,
  });

  return NextResponse.json({ url: subscription.payment_link });
}
