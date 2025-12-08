import fs from "fs";
import fetch from "node-fetch";

const MEDIAMODIFIER_API_KEY = "d3fef47a-11a7-4544-adcb-79eda60f2d84"; // Replace with your API Key
const BASE_URL = "https://api.mediamodifier.com/mockups";
const OUTPUT_FILE = "mockups.json";

async function fetchAllMockups() {
  let allMockups = [];
  let page = 1;
  let totalPages = 1;

  console.log("Fetching Mediamodifier mockups...");

  while (page <= totalPages) {
    console.log(`Fetching page ${page}...`);
    const response = await fetch(`${BASE_URL}?page=${page}`, {
      headers: {
        Accept: "application/json",
        api_key: MEDIAMODIFIER_API_KEY,
      },
    });

    if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      break;
    }

    const data = await response.json();
    if (!data.success || !data.mockups) {
      console.error("Unexpected response:", data);
      break;
    }

    allMockups.push(...data.mockups);
    totalPages = data.pages; // Update total page count
    page++; // Move to the next page
  }

  console.log(`Fetched ${allMockups.length} mockups.`);

  // Save to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allMockups, null, 2));
  console.log(`Data saved to ${OUTPUT_FILE}`);
}

// Run the function
fetchAllMockups();
