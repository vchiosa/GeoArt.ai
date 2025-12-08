const fs = require("fs");

// Your product array
const products = [
  {
    id: 1,
    name: "New York Skyline Mug",
    category: "Mugs",
    price: 14.99,
    image: "/products/mug-1.jpg",
  },
  {
    id: 2,
    name: "Paris Eiffel Tower Mug",
    category: "Mugs",
    price: 14.99,
    image: "/products/mug-2.jpg",
  },
  {
    id: 10,
    name: "New York Skyline T-Shirt",
    category: "T-Shirts",
    price: 24.99,
    image: "/products/tshirt-1.jpg",
  },
  {
    id: 11,
    name: "Tokyo Sakura T-Shirt",
    category: "T-Shirts",
    price: 24.99,
    image: "/products/tshirt-2.jpg",
  },
  {
    id: 19,
    name: "New York Skyline Hoodie",
    category: "Hoodies",
    price: 39.99,
    image: "/products/hoodie-1.jpg",
  },
  {
    id: 20,
    name: "London Big Ben Hoodie",
    category: "Hoodies",
    price: 39.99,
    image: "/products/hoodie-2.jpg",
  },
  {
    id: 28,
    name: "New York Skyline Wall Art",
    category: "Wall Art",
    price: 49.99,
    image: "/products/wallart-1.jpg",
  },
  {
    id: 37,
    name: "New York Skyline Sweatshirt",
    category: "Sweatshirts",
    price: 34.99,
    image: "/products/sweatshirt-1.jpg",
  },
  {
    id: 38,
    name: "Rome Colosseum Sweatshirt",
    category: "Sweatshirts",
    price: 34.99,
    image: "/products/sweatshirt-2.jpg",
  },
  {
    id: 46,
    name: "Barcelona Sagrada Familia Pillow",
    category: "Pillows",
    price: 19.99,
    image: "/products/pillow-1.jpg",
  },
  {
    id: 47,
    name: "Venice Grand Canal Pillow",
    category: "Pillows",
    price: 19.99,
    image: "/products/pillow-2.jpg",
  },
  {
    id: 55,
    name: "Amsterdam Canals Tote Bag",
    category: "Tote Bags",
    price: 24.99,
    image: "/products/totebag-1.jpg",
  },
  {
    id: 56,
    name: "Sydney Opera House Tote Bag",
    category: "Tote Bags",
    price: 24.99,
    image: "/products/totebag-2.jpg",
  },
  {
    id: 64,
    name: "San Francisco Golden Gate Phone Case",
    category: "Phone Cases",
    price: 29.99,
    image: "/products/phonecase-1.jpg",
  },
  {
    id: 65,
    name: "Dubai Skyline Phone Case",
    category: "Phone Cases",
    price: 29.99,
    image: "/products/phonecase-2.jpg",
  },
  {
    id: 73,
    name: "Aurora Borealis Blanket",
    category: "Blankets",
    price: 49.99,
    image: "/products/blanket-1.jpg",
  },
];

// Define headers in all lowercase (no brackets)
const headers = [
  "id",
  "title",
  "description",
  "price",
  "condition",
  "link",
  "availability",
  "image_link",
];

// Update the base URL to match your domain
const baseUrl = "https://geoart.ai";

// Create the rows array with the header (tab-separated)
const rows = [headers.join("\t")];

// Map each product into a TSV row
products.forEach((product) => {
  const row = [
    product.id, // id
    product.name, // title
    product.name, // description (customize as needed)
    `${product.price.toFixed(2)} USD`, // price
    "new", // condition
    `${baseUrl}/products/${product.id}`, // link
    "in_stock", // availability
    `${baseUrl}${product.image}`, // image_link
  ];
  rows.push(row.join("\t"));
});

// Combine all rows with newlines
const tsvContent = rows.join("\n");

// Write the file to disk
fs.writeFileSync("merchant_products.tsv", tsvContent);
console.log("Product file generated as merchant_products.tsv");
