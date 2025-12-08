import { NextResponse } from "next/server";
import Stripe from "stripe";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newline characters in the private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: Request) {
  try {
    // Extract the Firebase Auth token from the request headers
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];

    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded token:", decodedToken);

    const userId = decodedToken.uid;
    if (!userId) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    // Get cart items from the request body
    const { cartItems } = await request.json();
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart cannot be empty" },
        { status: 400 }
      );
    }

    console.log(`Processing checkout for user: ${userId}`);

    // Use Firebase Admin SDK for Firestore write (bypasses client-side rules)
    const firestore = admin.firestore();
    const cartRef = await firestore.collection("stripe_carts").add({
      userId,
      cartItems, // full cart stored in Firestore, not in metadata
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Construct line items for Stripe Checkout
    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productName,
        },
        unit_amount: Math.round(item.price * 100), // Convert price to cents
      },
      quantity: item.quantity,
    }));

    // Recalculate the total order amount from cart items (in dollars)
    const totalPrice = cartItems.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Shipping settings
    const freeShippingThreshold = 50; // in dollars
    const flatShippingRate = 8; // in dollars

    // Determine shipping cost
    let shippingCost = 0;
    if (totalPrice < freeShippingThreshold) {
      shippingCost = flatShippingRate;
    }

    // If there's a shipping cost, add it as an extra line item
    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shippingCost * 100), // Convert shipping cost to cents
        },
        quantity: 1,
      });
    }

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/checkout/success`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        cartRef: cartRef.id, // Store the Firestore document ID
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating Stripe Checkout Session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
