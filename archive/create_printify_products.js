import fetch from "node-fetch";
import fs from "fs";

// Your Printify API Key & Shop ID
const PRINTIFY_API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6ImExNmMyNmJkN2Y0YTJjMDM1YTU4Y2JjZWUxYWRmYzZhNDdlNDBjNGJkMTE2NDFjOGM4ZTdhMzMxZDRlMDI4NzU5NTA2YjEwZmY4MzIyODgxIiwiaWF0IjoxNzM5MzY2ODczLjY5NzExOCwibmJmIjoxNzM5MzY2ODczLjY5NzEyLCJleHAiOjE3NzA5MDI4NzMuNjg5MDE4LCJzdWIiOiI4NjEwMjkyIiwic2NvcGVzIjpbInNob3BzLm1hbmFnZSIsInNob3BzLnJlYWQiLCJjYXRhbG9nLnJlYWQiLCJvcmRlcnMucmVhZCIsIm9yZGVycy53cml0ZSIsInByb2R1Y3RzLnJlYWQiLCJwcm9kdWN0cy53cml0ZSIsIndlYmhvb2tzLnJlYWQiLCJ3ZWJob29rcy53cml0ZSIsInVwbG9hZHMucmVhZCIsInVwbG9hZHMud3JpdGUiLCJwcmludF9wcm92aWRlcnMucmVhZCIsInVzZXIuaW5mbyJdfQ.AUdOVZhQ0zI_R_TyL2_RCh7jiuic0lwrLKE55kh9T8OadmxbUeG3JXL79t7dViEQ2BRdigumexy5N5Cno-0";
const SHOP_ID = "20720471"; // Replace with your actual Printify Shop ID

// The list of products you want to create
const productMapping = {
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

async function uploadImageToPrintify(imageUrl) {
  console.log(`🚀 Uploading image to Printify: ${imageUrl}`);

  const response = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/images.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PRINTIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_url: imageUrl }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.error(`❌ Error uploading image:`, data);
    throw new Error(`Failed to upload image: ${data.message}`);
  }

  console.log(`✅ Image uploaded successfully - ID: ${data.id}`);
  return data.id; // Return the Printify Image ID
}

// Function to create a product in Printify
async function createProduct(productName, blueprintId, printProviderId) {
  const placeholderImage =
    "https://firebasestorage.googleapis.com/v0/b/xplor-407222.appspot.com/o/images%2F0oAUsdZcjRaJ4pRPht8az4wAIpc2%2F2024-05-24T22%3A55%3A26.429Z.jpg?alt=media&token=1e82885e-3aae-4dc5-97b0-e8feab5dafef"; // ✅ Publicly accessible image

  let imageId;
  try {
    imageId = await uploadImageToPrintify(placeholderImage);
  } catch (error) {
    console.error(`❌ Skipping ${productName} due to image upload failure.`);
    return null;
  }

  const payload = {
    title: `GeoArt ${productName}`,
    description: `Custom ${productName} featuring GeoArt designs.`,
    blueprint_id: blueprintId,
    print_provider_id: printProviderId,
    variants: [], // Variants will be chosen dynamically by the user
    images: [imageId], // ✅ Use Printify Image ID instead of external URL
    is_visible: true,

    print_areas: [
      {
        variant_ids: [], // No variants yet
        placeholders: [
          {
            position: "front",
            images: [
              {
                id: imageId, // ✅ Printify-assigned Image ID
                x: 0,
                y: 0,
                scale: 1,
                angle: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/products.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PRINTIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Error creating ${productName}:`, data);
      return null;
    }

    console.log(`✅ Created ${productName} - Product ID: ${data.id}`);
    return { productName, productId: data.id };
  } catch (error) {
    console.error(`❌ Error creating ${productName}:`, error);
    return null;
  }
}

// Run the script to create all products
async function main() {
  console.log("🚀 Starting product creation...");

  const createdProducts = [];

  for (const [
    productName,
    { blueprint_id, print_provider_id },
  ] of Object.entries(productMapping)) {
    const product = await createProduct(
      productName,
      blueprint_id,
      print_provider_id
    );
    if (product) {
      createdProducts.push(product);
    }
  }

  // Save created products to a JSON file
  fs.writeFileSync(
    "created_products.json",
    JSON.stringify(createdProducts, null, 2)
  );

  console.log(
    "✅ All products created successfully! Saved in `created_products.json`"
  );
}

main();
