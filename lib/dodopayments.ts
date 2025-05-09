import DodoPayments from "dodopayments";

export const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: "test_mode", // defaults to 'live_mode'
});

export async function main() {
  try {
    const subscription = await dodoClient.subscriptions.create({
      billing: {
        city: "KOL",
        country: "IN",
        state: "WB",
        street: "MGADHA",
        zipcode: "700129",
      },
      metadata: {
        uid: "sklfhsklhrfslkdfjslf",
      },
      customer: {
        email: "neel@neel.com",
        name: "neel",
        create_new_customer: true,
      },
      product_id: "pdt_HA0kgAFGBgeoDThQD1au1",
      payment_link: true,
      return_url: "https://example.com/success",
      quantity: 1,
    });
    console.log(subscription.payment_link);
  } catch (error) {
    console.log(error);
  }
}
