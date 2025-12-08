import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Readable } from "stream";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

// Disable Next.js default body parsing for raw Stripe webhook payloads
export const config = {
  api: {
    bodyParser: false,
  },
};

// 🔧 Convert ReadableStream<Uint8Array> to Buffer (Fix for TypeScript error)
async function streamToBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (readerDone) break;
    chunks.push(value);
  }

  const mergedArray = new Uint8Array(
    chunks.reduce((acc, val) => acc + val.length, 0)
  );
  let offset = 0;
  for (const chunk of chunks) {
    mergedArray.set(chunk, offset);
    offset += chunk.length;
  }

  return Buffer.from(mergedArray);
}

export async function POST(request: Request) {
  let event: Stripe.Event;
  const sig = request.headers.get("stripe-signature");

  // Convert ReadableStream to Buffer (fixing the error)
  const buf = await streamToBuffer(request.body!);

  try {
    // ✅ Verify Stripe webhook signature
    event = stripe.webhooks.constructEvent(
      buf,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // ✅ Handle successful payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Parse cart items from session metadata
    const cartItems = JSON.parse(session.metadata?.cartItems || "[]");
    console.log("✅ Payment success. Creating Printify order for:", cartItems);

    // Shipping info (could be retrieved from session metadata)
    const shippingAddress = {
      firstName: session.metadata?.firstName || "John",
      lastName: session.metadata?.lastName || "Doe",
      email: session.metadata?.email || "john@example.com",
      phone: session.metadata?.phone || "000-000-0000",
      country: session.metadata?.country || "US",
      state: session.metadata?.state || "CA",
      address: session.metadata?.address || "1234 Sunset Blvd",
      city: session.metadata?.city || "Los Angeles",
      zip: session.metadata?.zip || "90001",
    };

    // ✅ Create Printify Order
    const printifyRes = await fetch(
      `${process.env.FRONTEND_URL}/api/printify-create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems, shippingAddress }),
      }
    );
    const printifyData = await printifyRes.json();
    if (!printifyRes.ok) {
      console.error("❌ Failed to create order in Printify:", printifyData);
    } else {
      console.log(
        "✅ Printify order created successfully:",
        printifyData.order.id
      );
    }
  }

  // ✅ Return a 200 OK response
  return NextResponse.json({ received: true }, { status: 200 });
}
