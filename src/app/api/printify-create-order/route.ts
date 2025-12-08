import { NextResponse } from "next/server";

interface CartItem {
  printifyProductId: string;
  variant_id: number;
  quantity: number;
  price: number; // ✅ Ensure the price is included in each cart item
}

export async function POST(request: Request) {
  try {
    const { cartItems, shippingAddress } = (await request.json()) as {
      cartItems: CartItem[];
      shippingAddress: any;
    };

    // Check if all cart items have a variant_id
    const missingVariant = cartItems.find((item) => !item.variant_id);
    if (missingVariant) {
      return NextResponse.json(
        {
          error: `Missing variant selection for product ${missingVariant.printifyProductId}`,
        },
        { status: 400 }
      );
    }

    // Ensure all items have a valid price
    const invalidPriceItem = cartItems.find(
      (item) => typeof item.price !== "number" || item.price <= 0
    );
    if (invalidPriceItem) {
      return NextResponse.json(
        {
          error: `Invalid price detected for product ${invalidPriceItem.printifyProductId}`,
        },
        { status: 400 }
      );
    }

    // Your Printify shop ID
    const SHOP_ID = "20720471";

    // Compute total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    console.log(
      `🚀 Creating order with total price: $${totalPrice.toFixed(2)}`
    );

    // Build the order payload
    const orderPayload = {
      external_id: `geoart_order_${Date.now()}`, // Unique ID for tracking
      line_items: cartItems.map((item) => ({
        product_id: item.printifyProductId,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price, // ✅ Added price for logging purposes
      })),
      shipping_address: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        country: shippingAddress.country,
        region: shippingAddress.state,
        address1: shippingAddress.address,
        city: shippingAddress.city,
        zip: shippingAddress.zip,
      },
      send_shipping_notification: true,
    };

    console.log("📦 Order payload:", JSON.stringify(orderPayload, null, 2));

    // Create the order with Printify
    const response = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
          "Content-Type": "application/json",
          "User-Agent": "GeoArt-App",
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Failed to create Printify order:", data);
      return NextResponse.json(
        { error: "Failed to create order", details: data },
        { status: 400 }
      );
    }

    console.log("✅ Order successfully created:", data);

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
