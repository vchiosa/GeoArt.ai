import { storage, ref, getDownloadURL } from "./firebase";

export async function fetchCountryImage(
  country: string
): Promise<string | null> {
  try {
    console.log(`Fetching image for: ${country}`);

    // 🔥 Normalize country names to match filenames
    const formattedCountry = country
      .toLowerCase()
      .replace(/\s+/g, "") // Remove spaces
      .replace(/[^a-z]/g, ""); // Remove special characters (extra safety)

    console.log(`🔍 Looking for: countries/${formattedCountry}.jpg`);

    const imageRef = ref(storage, `countries/${formattedCountry}.jpg`);
    const url = await getDownloadURL(imageRef);

    console.log(`✅ Image URL: ${url}`);
    return url;
  } catch (error: any) {
    console.error(
      `❌ Error fetching image for ${country}:`,
      error.code || error.message
    );
    return null;
  }
}
