import fs from "fs";
import fetch from "node-fetch";

const API_KEY =
  "73806af7-187c-4cd9-9e54-a7270cf088c5:2fc96a9a3ccec5b26fa776c152f2e5b3f49bcd03464a627aaa818f9f62617f4d"; // Replace with your actual API Key
const BASE_URL = "https://app.dynamicmockups.com/api/v1/mockups";
const OUTPUT_FILE = "dynamic_mockups.json";

async function fetchAllMockups() {
  let allMockups = [];
  let page = 1;
  let lastCount = 0; // Track the last number of mockups retrieved

  console.log("Fetching mockups from DynamicMockups API...");

  while (true) {
    console.log(`Fetching page ${page}...`);

    try {
      const response = await fetch(`${BASE_URL}?page=${page}`, {
        headers: {
          Accept: "application/json",
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      // ✅ Stop if there are no new mockups
      if (
        !data.success ||
        !data.data ||
        data.data.length === 0 ||
        data.data.length === lastCount
      ) {
        console.log(`🚨 No new mockups found, stopping at page ${page}.`);
        break;
      }

      allMockups.push(...data.data);
      lastCount = data.data.length;
      page++; // Move to the next page
    } catch (error) {
      console.error("Error fetching mockups:", error);
      break;
    }
  }

  console.log(`✅ Fetched ${allMockups.length} mockups.`);

  // Save to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allMockups, null, 2));
  console.log(`✅ Mockups saved to ${OUTPUT_FILE}`);
}

// Run the function
fetchAllMockups();
