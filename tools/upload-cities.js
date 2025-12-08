import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// ✅ Define __dirname manually in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Load Firebase Admin SDK credentials
const serviceAccount = JSON.parse(fs.readFileSync("firebase-service-key.json"));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "xplor-407222.appspot.com", // Change this to your Firebase bucket
});

const bucket = getStorage().bucket();

// 📂 Local folder containing the city images
const localFolder = path.join(__dirname, "compressed-cities");

// 🔄 Recursive function to upload images
const uploadFolder = async (folderPath, storagePath = "") => {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const storageFilePath = path.join(storagePath, file).replace(/\\/g, "/"); // Ensure correct path format

    if (fs.lstatSync(fullPath).isDirectory()) {
      // If it's a subfolder (e.g., country folder), upload its contents
      await uploadFolder(fullPath, storageFilePath);
    } else if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      // Only upload image files
      const fileUpload = bucket.file(`compressed-cities/${storageFilePath}`);
      console.log(`🚀 Uploading: ${storageFilePath}`);

      try {
        await fileUpload.save(fs.readFileSync(fullPath), {
          metadata: { contentType: "image/jpeg" },
        });
        console.log(`✅ Uploaded: ${storageFilePath}`);
      } catch (error) {
        console.error(`❌ Error uploading ${file}:`, error);
      }
    }
  }
};

// 📤 Start Upload
(async () => {
  console.log("📂 Uploading images from 'compressed-cities' to Firebase...");
  await uploadFolder(localFolder);
  console.log("🎉 All images uploaded successfully!");
})();
