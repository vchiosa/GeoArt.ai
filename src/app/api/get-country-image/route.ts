import { NextRequest, NextResponse } from "next/server";
import { fetchCountryImage } from "@/utils/fetchCountryImage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");

  if (!country) {
    return NextResponse.json(
      { error: "Country name is required" },
      { status: 400 }
    );
  }

  const imageUrl = await fetchCountryImage(country);

  if (!imageUrl) {
    return NextResponse.json({ error: "No image found" }, { status: 404 });
  }

  return NextResponse.json({ imageUrl });
}
