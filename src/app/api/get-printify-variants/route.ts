// src/app/api/get-printify-variants/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productCategory = searchParams.get("productCategory");

  if (!productCategory) {
    return NextResponse.json(
      { error: "Missing productCategory parameter" },
      { status: 400 }
    );
  }

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

  // Mapping for base cost in cents for fixed pricing
  const baseCostMapping: Record<string, number> = {
    Mugs: 799,
    "T-Shirts": 1199,
    Hoodies: 1999,
    "Wall Art": 1499,
    Sweatshirts: 1799,
    Pillows: 999,
    "Tote Bags": 899,
    "Phone Cases": 1099,
    Blankets: 2499,
  };

  const mapping = productMapping[productCategory];
  if (!mapping) {
    return NextResponse.json(
      { error: "Invalid product category" },
      { status: 400 }
    );
  }
  const { blueprint_id, print_provider_id } = mapping;

  // Fetch the available variants from Printify
  const response = await fetch(
    `https://api.printify.com/v1/catalog/blueprints/${blueprint_id}/print_providers/${print_provider_id}/variants.json`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch variants from Printify" },
      { status: response.status }
    );
  }
  const data = await response.json();

  // Calculate a fixed retail price based on the base cost and a 50% margin.
  const baseCost = baseCostMapping[productCategory] || 1000; // in cents
  const retailPrice = (baseCost * 1.5) / 100; // convert to dollars

  // Return variants with the fixed price added (same for all variants)
  const variantsWithFixedPrice = data.variants.map((variant: any) => ({
    id: variant.id,
    title: variant.title,
    options: variant.options,
    price: retailPrice, // Fixed price in dollars
  }));

  return NextResponse.json({ variants: variantsWithFixedPrice });
}
