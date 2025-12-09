// src/utils/fetchCityImage.ts
import { storage, ref, getDownloadURL } from "./firebase";

export async function fetchCityImage(
  country: string,
  city: string
): Promise<string | null> {
  try {
    console.log(
      `Fetching compressed image for city: ${city} in country: ${country}`
    );

    // Normalize the country and city names:
    // - Lowercase
    // - Remove spaces
    // - Remove any non-alphabetic characters
    const formattedCountry = country
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z]/g, "");
    const formattedCity = city
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z]/g, "");

    // Construct the storage path
    const imagePath = `compressed-cities/${formattedCountry}/${formattedCity}.jpg`;
    console.log(`Looking for compressed city image at: ${imagePath}`);

    // Get the download URL
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    console.log(`✅ Found compressed city image URL: ${url}`);
    return url;
  } catch (error: any) {
    console.error(
      `❌ Error fetching compressed image for ${city} in ${country}:`,
      error.code || error.message
    );
    return null;
  }
}
