"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { categories } from "@/constants";

function ProductCustomizer() {
  const searchParams = useSearchParams();
  const designUrl = searchParams.get("designUrl");
  const router = useRouter();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());

  // Generate a product mockup based on the selected category and design URL
  const handleProductSelect = async (category: string) => {
    const selectedCat = categories.find((cat) => cat.name === category);
    if (selectedCat?.comingSoon) return; // Do nothing for comingSoon categories

    setSelectedCategory(category);
    setLoading(true);
    setError(null);
    setMockupUrl(null);

    try {
      const res = await fetch(
        `/api/generate-product-mockups?productCategory=${encodeURIComponent(
          category
        )}&designImageUrl=${encodeURIComponent(designUrl || "")}`
      );
      if (!res.ok) throw new Error("Failed to generate mockup");
      const data = await res.json();
      setMockupUrl(data.productImageUrl);
    } catch (error) {
      console.error("Error generating product mockup:", error);
      setError("Failed to generate product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add the generated product mockup to the user's cart
  const handleAddToCart = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!selectedCategory || !mockupUrl) return;
    if (addedToCart.has(selectedCategory)) return; // Prevent duplicates

    setCartLoading(selectedCategory);

    const baseCostMapping: Record<string, number> = {
      Mugs: 799,
      "T-Shirts": 1199,
      Hoodies: 1999,
      "Wall Art": 1499,
      Sweatshirts: 1799,
      Pillows: 999,
      "Tote Bags": 899,
      "Phone Cases": 1099,
      Blankets: 2499,
    };

    const baseCost = baseCostMapping[selectedCategory] ?? 1000;
    const fixedPrice = (baseCost * 1.5) / 100;

    try {
      await addDoc(collection(db, "carts"), {
        userId: user.uid,
        productName: `${selectedCategory}`,
        price: fixedPrice,
        quantity: 1,
        imageUrl: mockupUrl,
        productCategory: selectedCategory,
        variant_id: null,
        createdAt: serverTimestamp(),
      });
      setAddedToCart(new Set(addedToCart).add(selectedCategory));
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setCartLoading(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <h1 className="text-4xl text-white text-center mb-8">
        Customize Your Product
      </h1>

      {/* Display the Selected Design */}
      {designUrl && (
        <div className="max-w-sm mx-auto mb-8">
          <Image
            src={designUrl}
            alt="Selected Design"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      )}

      {/* Render Product Categories */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Select a Product
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={!cat.comingSoon ? { scale: 1.05 } : {}}
              whileTap={!cat.comingSoon ? { scale: 0.95 } : {}}
              className="relative"
            >
              <Button
                onClick={() => !cat.comingSoon && handleProductSelect(cat.name)}
                disabled={cat.comingSoon || loading}
                className={`w-full h-32 flex flex-col items-center justify-center space-y-2 border-2 border-white/30 transition-all duration-300 ${
                  cat.comingSoon
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
                variant="ghost"
              >
                <cat.icon className="h-8 w-8" />
                <span className="text-sm font-medium">{cat.name}</span>
              </Button>
              {cat.comingSoon && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Loading spinner when generating mockup */}
      {loading && (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
          <p className="mt-2 text-white text-lg font-semibold">
            Generating mockup...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-center text-red-400 mt-4">{error}</p>}

      {/* Display the Generated Product Mockup */}
      {mockupUrl && (
        <div className="max-w-sm mx-auto mb-4">
          <Image
            src={mockupUrl}
            alt={`Product with ${selectedCategory} design`}
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      )}

      {/* Add to Cart Button */}
      {mockupUrl && (
        <div className="max-w-sm mx-auto mb-8">
          <Button
            onClick={handleAddToCart}
            disabled={
              addedToCart.has(selectedCategory as string) ||
              cartLoading === selectedCategory
            }
            className={`w-full ${
              addedToCart.has(selectedCategory as string)
                ? "bg-green-500 text-white cursor-default"
                : "bg-white text-purple-600 hover:bg-white/90"
            }`}
          >
            {addedToCart.has(selectedCategory as string)
              ? "✅ Added!"
              : cartLoading === selectedCategory
              ? "Adding..."
              : "Add to Cart"}
          </Button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-8">
        <Button
          onClick={() => router.push("/styles")}
          variant="outline"
          className="bg-white/20 text-white hover:bg-white/30 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Styles
        </Button>
        <Button
          onClick={() => router.push("/my-cart")}
          variant="outline"
          className="bg-white/20 text-white hover:bg-white/30 flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Go to My Cart
        </Button>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="bg-white/20 text-white hover:bg-white/30"
        >
          Home
        </Button>
      </div>
    </div>
  );
}

export default function CreateProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-white">
          Loading...
        </div>
      }
    >
      <ProductCustomizer />
    </Suspense>
  );
}
