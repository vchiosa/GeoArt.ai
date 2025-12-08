const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// 📁 Source & Destination Folder
const inputRoot = path.join(__dirname, "city-images"); // Root folder containing country folders
const outputRoot = path.join(__dirname, "compressed"); // Destination root for resized images

// Ensure output root folder exists
if (!fs.existsSync(outputRoot)) {
  fs.mkdirSync(outputRoot, { recursive: true });
}

// Resize settings
const targetWidth = 800; // Resize width
const quality = 80; // JPEG compression quality

// Function to recursively resize images in subfolders
const resizeImages = async (dir, outputDir) => {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read all files and subdirectories
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const inputPath = path.join(dir, item);
    const outputPath = path.join(outputDir, item);

    if (fs.lstatSync(inputPath).isDirectory()) {
      // Recursively process subfolders (country folders)
      await resizeImages(inputPath, outputPath);
    } else if (fs.lstatSync(inputPath).isFile()) {
      console.log(`🔄 Resizing: ${inputPath}`);

      try {
        await sharp(inputPath)
          .resize({ width: targetWidth }) // Resize width, auto height
          .jpeg({ quality }) // Convert to optimized JPEG
          .toFile(outputPath);

        console.log(`✅ Saved: ${outputPath}`);
      } catch (error) {
        console.error(`❌ Error resizing ${inputPath}:`, error);
      }
    }
  }
};

// Start processing the city-images folder
(async () => {
  await resizeImages(inputRoot, outputRoot);
  console.log("🎉 All images resized successfully!");
})();
