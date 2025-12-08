// src/app/product/page.tsx
"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SelectionContext } from "../../context/SelectionContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, ArrowLeft, ZoomIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ImageModal } from "@/components/ImageModal";

interface Design {
  style: string;
  designImageUrl: string;
}

interface ProductMockup {
  style: string;
  productImageUrl: string;
}

export default function Product() {
  const { productCategory, country, city, styles } =
    useContext(SelectionContext);
  const { user } = useAuth();
  const router = useRouter();

  const [designs, setDesigns] = useState<Design[]>([]);
  const [productMockups, setProductMockups] = useState<ProductMockup[]>([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(true);
  const [isLoadingMockups, setIsLoadingMockups] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const fetchedStyles = useRef(new Set<string>());
  const fetchedMockups = useRef(new Set<string>());

  const [cartLoading, setCartLoading] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchDesigns() {
      // Ensure a user is authenticated
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      if (styles.length > 0 && designs.length === 0) {
        try {
          const generatedDesigns = await Promise.all(
            styles.map(async (style) => {
              if (fetchedStyles.current.has(style)) {
                return null;
              }

              const res = await fetch(
                `/api/generate-image?style=${encodeURIComponent(
                  style
                )}&city=${encodeURIComponent(city)}&userId=${user.uid}`
              );
              const data = await res.json();

              fetchedStyles.current.add(style);
              return data.imageUrl
                ? { style, designImageUrl: data.imageUrl }
                : null;
            })
          );

          setDesigns(
            generatedDesigns.filter(
              (design): design is Design => design !== null
            )
          );
        } catch (error) {
          console.error("Error fetching design images:", error);
        } finally {
          setIsLoadingDesigns(false);
        }
      }
    }

    fetchDesigns();
  }, [styles, city, designs.length, user]);

  useEffect(() => {
    async function fetchProductMockups() {
      if (designs.length > 0 && productMockups.length === 0) {
        try {
          setIsLoadingMockups(true);

          const generatedMockups = await Promise.all(
            designs.map(async (design) => {
              if (fetchedMockups.current.has(design.designImageUrl)) {
                return null;
              }

              const res = await fetch(
                `/api/generate-product-mockups?productCategory=${encodeURIComponent(
                  productCategory
                )}&designImageUrl=${encodeURIComponent(design.designImageUrl)}`
              );
              const data = await res.json();

              fetchedMockups.current.add(design.designImageUrl);
              return data.productImageUrl
                ? { style: design.style, productImageUrl: data.productImageUrl }
                : null;
            })
          );

          setProductMockups(
            generatedMockups.filter(
              (mockup): mockup is ProductMockup => mockup !== null
            )
          );
        } catch (error) {
          console.error("Error fetching product mockups:", error);
        } finally {
          setIsLoadingMockups(false);
        }
      }
    }

    if (
      !isLoadingDesigns &&
      designs.length > 0 &&
      productMockups.length === 0
    ) {
      fetchProductMockups();
    }
  }, [designs, productCategory, isLoadingDesigns]);

  const handleAddToCart = async (mockup: ProductMockup) => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (addedToCart.has(mockup.style)) return; // Prevent re-adding the same item

    setCartLoading(mockup.style); // Show loading state for this specific item

    // Correct base costs (in cents) with 50% markup
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

    // Calculate the retail price with a 50% margin
    const baseCost = baseCostMapping[productCategory] ?? 1000; // Default to 1000 cents if not found
    const fixedPrice = (baseCost * 1.5) / 100; // Convert cents to dollars

    try {
      // Add item to Firestore (now with dynamically calculated price)
      await addDoc(collection(db, "carts"), {
        userId: user.uid,
        productName: `${productCategory} - ${mockup.style}`,
        price: fixedPrice, // ✅ Now setting the correct dynamic price
        quantity: 1,
        imageUrl: mockup.productImageUrl,
        productCategory,
        variant_id: null, // No variant chosen yet
        createdAt: serverTimestamp(),
      });

      console.log(
        `✅ Item added to cart with price: $${fixedPrice.toFixed(2)}`
      );
      setAddedToCart((prev) => new Set(prev).add(mockup.style));
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    } finally {
      setCartLoading(null);
    }
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-5xl font-bold text-white text-center mb-2">
          Your GeoArt Creations
        </h1>
        <p className="text-2xl text-white text-center mb-8">
          {productCategory} inspired by {city}, {country}
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          {/* Design Images */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Design Images
            </h2>
            {isLoadingDesigns ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <AnimatePresence>
                  {designs.map((design, index) => (
                    <motion.div
                      key={design.style}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/20 rounded-lg overflow-hidden shadow-lg p-6"
                    >
                      {/* Square Image Container */}
                      <div className="relative w-full max-w-[16rem] aspect-square mx-auto overflow-hidden group">
                        <Image
                          src={design.designImageUrl || "/placeholder.svg"}
                          alt={design.style}
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-lg transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          onClick={() => openModal(design.designImageUrl)}
                        >
                          <ZoomIn className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-white text-lg font-semibold">
                          {design.style}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Product Mockups */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Product Mockups
            </h2>
            {isLoadingMockups ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {productMockups.map((mockup, index) => (
                    <motion.div
                      key={mockup.style}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/20 rounded-lg overflow-hidden shadow-lg p-4"
                    >
                      {/* Updated Square Image Container with zoom on click */}
                      <div className="relative w-full max-w-[16rem] aspect-square mx-auto overflow-hidden group">
                        <Image
                          src={mockup.productImageUrl || "/placeholder.svg"}
                          alt={`Product with ${mockup.style} design`}
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-lg transition-transform duration-300 group-hover:scale-110"
                        />
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          onClick={() => openModal(mockup.productImageUrl)}
                        >
                          <ZoomIn className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <div className="p-4 text-center">
                        <p className="text-white text-lg font-semibold mb-2">
                          {mockup.style}
                        </p>
                        <Button
                          onClick={() => handleAddToCart(mockup)}
                          disabled={addedToCart.has(mockup.style)}
                          className={`w-full ${
                            addedToCart.has(mockup.style)
                              ? "bg-green-500 text-white cursor-default"
                              : "bg-white text-purple-600 hover:bg-white/90"
                          }`}
                        >
                          {addedToCart.has(mockup.style)
                            ? "✅ Added!"
                            : "Add to Cart"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button
              onClick={() => router.push("/styles")}
              variant="outline"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Styles
            </Button>

            {/* 1) Go to My Cart */}
            <Button
              onClick={() => router.push("/my-cart")}
              variant="outline"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Go to My Cart
            </Button>

            {/* 2) Go to Home */}
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              Home
            </Button>
          </div>
        </motion.div>
      </motion.div>
      <ImageModal
        isOpen={!!modalImage}
        onClose={closeModal}
        imageUrl={modalImage || ""}
        alt="Enlarged view"
      />
    </div>
  );
}
