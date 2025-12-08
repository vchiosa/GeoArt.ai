// src/constants.ts
import {
  Coffee,
  Shirt,
  Layout,
  Smartphone,
  BedDouble,
  ShoppingBag,
  BedSingle,
  Circle, // ✅ Circle icon for plates
} from "lucide-react";

export const categories = [
  { name: "Mugs", icon: Coffee },
  { name: "T-Shirts", icon: Shirt },
  { name: "Hoodies", icon: Shirt },
  { name: "Wall Art", icon: Layout },
  { name: "Sweatshirts", icon: Shirt },
  { name: "Pillows", icon: BedDouble },
  { name: "Tote Bags", icon: ShoppingBag },
  { name: "Phone Cases", icon: Smartphone },
  { name: "Blankets", icon: BedSingle },
  { name: "Plates", icon: Circle, comingSoon: true },
];
