// src/app/api/generate-product-mockups/route.ts
import { NextResponse } from "next/server";

const productMockupMap: Record<string, string[]> = {
  "T-Shirts": [
    "71477cce-5357-492c-b39f-a9455ca99d6c",
    "d9713795-1704-489a-bbbe-9ec59005227d",
    "10cc146c-022b-4b81-8c5d-181888ff5669",
  ],
  Hoodies: [
    "765ff7db-ca41-418c-9be3-a8d386ae24a3",
    "b7c46fe9-35c0-4d53-ad40-e2ca2b1cd26a",
    "095683f8-27bf-4c94-9dde-e9f3de7e8bae",
  ],
  "Wall Art": [
    "5d4cc4dd-00c5-4e39-bb19-908d2d0b0a4d",
    "1ed402a6-5631-433a-949c-97e96cadc69d",
    "864ccbe1-5acd-41cc-86e2-2d16da5c85c5",
  ],
  Mugs: [
    "a6ca1605-e74a-4296-9e26-f0cf95654c1e",
    "740b623f-89b7-40e0-b61c-fbe6dce352d6",
    "c24435d4-0a35-4a73-9b46-9fd9dd27cc36",
  ],
  Sweatshirts: [
    "d582b9d5-7bf3-40fc-b62c-5ac9e5b4060c",
    "73ced206-7d6c-4d2d-9cb8-33fa647cbdc3",
    "61b97bc7-f83b-49b5-aa87-4d1ad0c6b812",
  ],
  Pillows: [
    "9d1b6c58-0f71-4c4e-881e-91eccf205d07",
    "ec5f189b-5d78-40ea-a7cf-011fe1e1d13b",
    "a1fcf751-231e-4109-a8ea-135ca8847d4b",
  ],
  "Tote Bags": [
    "9db3ce12-3dc2-4213-948d-b3a085fded2d",
    "8894d499-5ad4-40b2-ae9b-3244af171bb2",
    "425083bb-64bf-49b5-a440-ddab02d84a77",
  ],
  "Phone Cases": [
    "11cef4ca-62af-4eb2-bff5-ad86b25ecb9e",
    "a88a671c-692a-492c-b2e8-0683fdce6359",
    "b5519d69-b0e7-4b85-98b9-93b28a628301",
  ],
  Blankets: [
    "175af254-a090-440f-a758-ecb638c6fc21",
    "87d63281-4370-435f-a654-4f6b768ebd34",
    "d061597a-ea9a-442a-87a8-afa4faffdff9",
  ],
};

function getRandomElement(arr: string[]): string {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const smartObjectKeyMap: Record<string, string> = {
  "T-Shirts": "t-shirt",
  Hoodies: "hoodie",
  "Wall Art": "artwork",
  Mugs: "artwork",
  Sweatshirts: "sweatshirt",
  Pillows: "pillow",
  "Tote Bags": "tote",
  "Phone Cases": "phone case",
  Blankets: "blanket",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productCategory = searchParams.get("productCategory");
  const designImageUrl = searchParams.get("designImageUrl");

  if (!productCategory || !designImageUrl) {
    console.error("Missing required params:", {
      productCategory,
      designImageUrl,
    });
    return NextResponse.json(
      {
        error: "Missing required params: productCategory and/or designImageUrl",
      },
      { status: 400 }
    );
  }

  const DYNAMIC_API_KEY = process.env.DYNAMICMOCKUPS_API_KEY;
  if (!DYNAMIC_API_KEY) {
    console.error("Missing API key!");
    return NextResponse.json(
      { error: "Missing DYNAMICMOCKUPS_API_KEY environment variable" },
      { status: 500 }
    );
  }

  const mockupArray = productMockupMap[productCategory];
  if (!mockupArray || mockupArray.length === 0) {
    console.error(
      `No predefined mockup UUIDs found for category: ${productCategory}`
    );
    return NextResponse.json(
      {
        error: `No predefined mockup UUIDs found for category: ${productCategory}`,
      },
      { status: 404 }
    );
  }

  const selectedMockupUuid = getRandomElement(mockupArray);

  try {
    const detailsResponse = await fetch(
      `https://app.dynamicmockups.com/api/v1/mockup/${selectedMockupUuid}`,
      {
        headers: {
          Accept: "application/json",
          "x-api-key": DYNAMIC_API_KEY,
        },
      }
    );
    const detailsData = await detailsResponse.json();
    if (!detailsResponse.ok || !detailsData.success || !detailsData.data) {
      return NextResponse.json(
        { error: "Failed to retrieve mockup details", details: detailsData },
        { status: 500 }
      );
    }
    const mockup = detailsData.data;

    const keyword = smartObjectKeyMap[productCategory]?.toLowerCase() || "";
    const modifiedSmartObjects = mockup.smart_objects.map((obj: any) => {
      if (obj.name && obj.name.toLowerCase().includes(keyword)) {
        return {
          ...obj,
          asset: {
            ...obj.asset,
            url: designImageUrl,
            fit: "cover",
          },
        };
      }
      return obj;
    });

    const exportLabel = `GeoArt_${productCategory}_${Date.now()}`;
    const renderPayload = {
      mockup_uuid: selectedMockupUuid,
      export_label: exportLabel,
      export_options: {
        image_format: "jpg",
        image_size: 1500,
      },
      smart_objects: modifiedSmartObjects,
    };

    const renderResponse = await fetch(
      "https://app.dynamicmockups.com/api/v1/renders",
      {
        method: "POST",
        headers: {
          "x-api-key": DYNAMIC_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(renderPayload),
      }
    );

    const renderData = await renderResponse.json();

    if (!renderResponse.ok || !renderData.success) {
      return NextResponse.json(
        { error: "Failed to render the product mockup", details: renderData },
        { status: 500 }
      );
    }

    // Persist the generated image to Firebase Storage so the URL doesn't expire.
    const tempUrl = renderData.data.export_path;
    const permanentUrl = await persistImage(tempUrl);

    return NextResponse.json({ productImageUrl: permanentUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: error.message },
      { status: 500 }
    );
  }
}

async function persistImage(tempUrl: string): Promise<string> {
  // Fetch the image as a blob
  const response = await fetch(tempUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch image from temporary URL");
  }
  const blob = await response.blob();

  // Get Firebase Storage instance
  // Ensure that "app" is your initialized Firebase app from "@/utils/firebase"
  const {
    getStorage,
    ref: storageRef,
    uploadBytes,
    getDownloadURL,
  } = await import("firebase/storage");
  const storage = getStorage();
  const filename = `mockups/${Date.now()}.jpg`;
  const ref = storageRef(storage, filename);

  // Upload the blob to Firebase Storage
  await uploadBytes(ref, blob);
  // Get the permanent URL
  const permanentUrl = await getDownloadURL(ref);
  return permanentUrl;
}
