// src/app/api/generate-image/route.ts
import { NextResponse } from "next/server";
import { storage, ref, uploadBytes, getDownloadURL } from "@/utils/firebase";
import { v4 as uuidv4 } from "uuid"; // Generates unique file names

// Securely retrieve your OpenAI API key from environment variables
const DALL_E_API_KEY = process.env.DALL_E_API_KEY;
if (!DALL_E_API_KEY) {
  throw new Error("Missing DALL_E_API_KEY environment variable.");
}

/**
 * Calls OpenAI's DALL·E 3 API to generate an image.
 */
async function generateImage(
  prompt: string,
  size = "1024x1024"
): Promise<string | null> {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DALL_E_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.data?.length) {
      console.error("DALL·E API Error:", data);
      throw new Error(`API request failed: ${response.status}`);
    }

    return data.data[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

/**
 * Uploads the generated image to Firebase Storage under the user's folder.
 */
async function uploadImageToFirebase(
  userId: string,
  imageUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();

    // Store image under the user's folder in Firebase Storage
    const fileName = `users/${userId}/dalle-images/${uuidv4()}.png`;
    const storageRef = ref(storage, fileName);

    // Upload image
    await uploadBytes(storageRef, Buffer.from(imageBuffer), {
      contentType: "image/png",
    });

    // Get public URL from Firebase
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    return null;
  }
}

/**
 * GET /api/generate-image?style=...&city=...&userId=...
 *
 * Query Parameters:
 * - style: The art style to use (e.g., "Modern").
 * - city: The city name to include in the prompt (e.g., "New York").
 * - userId: The ID of the user requesting the image.
 *
 * Returns: JSON with the Firebase-hosted image URL.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style") || "";
  const city = searchParams.get("city") || "";
  const userId = searchParams.get("userId");

  if (!style || !city || !userId) {
    return NextResponse.json(
      { error: "Missing required parameters: style, city, or userId" },
      { status: 400 }
    );
  }

  const prompt = `A highly detailed, artistic digital painting in the ${style} style, capturing the essence and beauty of ${city}.`;

  try {
    // Step 1: Generate image using DALL·E
    const openAiImageUrl = await generateImage(prompt);
    if (!openAiImageUrl) {
      throw new Error("Image generation failed.");
    }

    // Step 2: Upload to Firebase under the user's folder
    const firebaseUrl = await uploadImageToFirebase(userId, openAiImageUrl);
    if (!firebaseUrl) {
      throw new Error("Failed to upload image to Firebase.");
    }

    return NextResponse.json({ imageUrl: firebaseUrl, userId });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
