// src/app/api/create-printify-product/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productCategory, designImageUrl } = body;

    if (!productCategory || !designImageUrl) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: productCategory or designImageUrl",
        },
        { status: 400 }
      );
    }

    // Your Printify shop ID
    const SHOP_ID = "20720471";

    // Mapping for blueprint and provider
    const productMapping: Record<
      string,
      { blueprint_id: number; print_provider_id: number }
    > = {
      Mugs: { blueprint_id: 478, print_provider_id: 28 },
      "T-Shirts": { blueprint_id: 498, print_provider_id: 217 },
      Hoodies: { blueprint_id: 592, print_provider_id: 83 },
      "Wall Art": { blueprint_id: 609, print_provider_id: 74 },
      Sweatshirts: { blueprint_id: 679, print_provider_id: 26 },
      Pillows: { blueprint_id: 809, print_provider_id: 72 },
      "Tote Bags": { blueprint_id: 836, print_provider_id: 72 },
      "Phone Cases": { blueprint_id: 841, print_provider_id: 88 },
      Blankets: { blueprint_id: 993, print_provider_id: 66 },
    };

    // Mapping for base cost in cents for each category (you can adjust these values)
    const baseCostMapping: Record<string, number> = {
      Mugs: 899, // $8.99
      "T-Shirts": 1299, // $12.99
      Hoodies: 1999, // $19.99
      "Wall Art": 1499, // $14.99
      Sweatshirts: 1799, // $17.99
      Pillows: 999, // $9.99
      "Tote Bags": 899, // $8.99
      "Phone Cases": 1099, // $10.99
      Blankets: 2499, // $24.99
    };

    const mapping = productMapping[productCategory];
    if (!mapping) {
      return NextResponse.json(
        { error: "Product category not supported" },
        { status: 400 }
      );
    }

    const { blueprint_id, print_provider_id } = mapping;

    // Create the product (without variant pricing for now)
    const productPayload = {
      title: `${productCategory} - Custom GeoArt`,
      description: "A unique GeoArt design inspired by cityscapes.",
      print_provider_id,
      blueprint_id,
      images: [designImageUrl],
      is_visible: true,
    };

    const createResponse = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/products.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
          "Content-Type": "application/json",
          "User-Agent": "GeoArt-App",
        },
        body: JSON.stringify(productPayload),
      }
    );

    const createData = await createResponse.json();
    if (!createResponse.ok) {
      return NextResponse.json(
        { error: "Failed to create product", details: createData },
        { status: createResponse.status }
      );
    }

    // Retrieve the base cost (in cents) and calculate the retail price with 50% margin
    const baseCost = baseCostMapping[productCategory] || 1000; // default if not found
    const retailPriceCents = Math.round(baseCost * 1.5);

    // Get product ID from the creation response
    const productId = createData.id;

    // Fetch full product details to get the variants array
    const productDetailsResponse = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/products/${productId}.json`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const productDetails = await productDetailsResponse.json();

    // Create an updated variants array with our fixed pricing.
    // We assume each variant gets the same retail price.
    const updatedVariants = productDetails.variants.map((variant: any) => ({
      id: variant.id,
      // Set the retail price (in cents) for this variant
      price: retailPriceCents,
    }));

    const updatePayload = {
      variants: updatedVariants,
    };

    // Update the product with our pricing information
    const updateResponse = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/products/${productId}.json`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
          "Content-Type": "application/json",
          "User-Agent": "GeoArt-App",
        },
        body: JSON.stringify(updatePayload),
      }
    );
    const updateData = await updateResponse.json();
    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: "Failed to update product with pricing", details: updateData },
        { status: updateResponse.status }
      );
    }

    return NextResponse.json({ success: true, product: updateData });
  } catch (error: any) {
    console.error("Error creating Printify product:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
