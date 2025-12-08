"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, Trash2, Minus, Plus, Truck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getAuth } from "firebase/auth";
import { ImageModal } from "@/components/ImageModal";
import Header from "@/components/Header";

interface CartItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  productCategory: string; // must be set when added to cart
  variant_id?: number; // user-selected variant (if any)
}

interface VariantOption {
  id: number;
  title: string;
  options: Record<string, string>;
}

interface VariantDropdownProps {
  productCategory: string;
  currentVariantId?: number;
  onSelect: (variant: VariantOption) => void;
}

function VariantDropdown({
  productCategory,
  currentVariantId,
  onSelect,
}: VariantDropdownProps) {
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVariants() {
      try {
        const res = await fetch(
          `/api/get-printify-variants?productCategory=${encodeURIComponent(
            productCategory
          )}`
        );
        const data = await res.json();
        if (data.variants && Array.isArray(data.variants)) {
          setVariants(data.variants);
        } else {
          setVariants([]);
        }
      } catch (err) {
        console.error("Error fetching variants:", err);
        setVariants([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVariants();
  }, [productCategory]);

  if (loading) return <p>Loading variants...</p>;
  if (!variants.length) return <p>No variant options available.</p>;

  return (
    <select
      value={currentVariantId ? String(currentVariantId) : ""}
      onChange={(e) => {
        const selectedId = Number(e.target.value);
        const variant = variants.find((v) => v.id === selectedId);
        if (variant) {
          onSelect(variant);
        }
      }}
      className="p-2 bg-white text-black rounded-md w-40 truncate"
    >
      <option value="" disabled className="truncate">
        Select variant
      </option>
      {variants.map((variant) => (
        <option key={variant.id} value={variant.id} className="truncate">
          {variant.title}
        </option>
      ))}
    </select>
  );
}

export default function MyCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const cartRef = collection(db, "carts");
          const q = query(cartRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const items: CartItem[] = [];
          querySnapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() } as CartItem);
          });

          setCartItems(items);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle variant selection from dropdown
  const handleVariantSelect = async (
    itemId: string,
    variant: VariantOption
  ) => {
    try {
      const itemRef = doc(db, "carts", itemId);
      await updateDoc(itemRef, {
        variant_id: variant.id,
      });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, variant_id: variant.id } : item
        )
      );
      console.log(`Variant updated for item ${itemId} to ${variant.title}`);
    } catch (error) {
      console.error("Error updating variant:", error);
    }
  };

  // Remove cart item
  const handleRemoveItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, "carts", itemId));
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      console.log(`Item with ID ${itemId} removed from cart`);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingItem(itemId);
    try {
      const itemRef = doc(db, "carts", itemId);
      await updateDoc(itemRef, { quantity: newQuantity });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      console.log(`Quantity updated for item ${itemId}: ${newQuantity}`);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItem(null);
    }
  };

  // Calculate subtotal
  const totalPrice = cartItems.reduce((sum, item) => {
    const safePrice = item.price ?? 0; // interpret null as 0
    return sum + safePrice * item.quantity;
  }, 0);

  // Shipping strategy:
  // Free shipping on orders over $50, flat rate of $5 if below threshold.
  const freeShippingThreshold = 50; // in dollars
  const flatShippingRate = 8; // in dollars
  const shippingCost =
    totalPrice >= freeShippingThreshold ? 0 : flatShippingRate;
  const amountNeededForFreeShipping =
    totalPrice >= freeShippingThreshold
      ? 0
      : freeShippingThreshold - totalPrice;
  const freeShippingProgress = Math.min(
    (totalPrice / freeShippingThreshold) * 100,
    100
  );

  // Modal helper functions
  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };
  const closeModal = () => {
    setModalImage(null);
  };

  // Proceed to checkout: at this point, every cart item should have a selected variant.
  const handleCheckout = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You need to be logged in to proceed to checkout.");
      return;
    }

    const idToken = await user.getIdToken(); // ✅ Get Firebase Auth Token

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // ✅ Send token in header
        },
        body: JSON.stringify({ cartItems }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout session URL returned:", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <Header />
      <div className="max-w-4xl mx-auto  p-4 sm:p-8 pt-20">
        <h1 className="text-3xl sm:text-5xl font-bold text-white text-center mb-8">
          My Cart
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : cartItems.length > 0 ? (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between py-4 border-b border-white/20 last:border-b-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    {/* Make the image clickable to open the modal */}
                    <div
                      className="cursor-pointer"
                      onClick={() => openModal(item.imageUrl)}
                    >
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {item.productName}
                      </h3>
                      <p className="text-white/70">
                        {typeof item.price === "number"
                          ? `$${item.price.toFixed(2)}`
                          : "Select a variant"}
                      </p>

                      <p className="text-white/70">
                        Category: {item.productCategory}
                      </p>
                    </div>
                  </div>

                  {/* Variant Dropdown */}
                  <div className="mt-2 md:mt-0">
                    <VariantDropdown
                      productCategory={item.productCategory}
                      currentVariantId={item.variant_id}
                      onSelect={(variant) =>
                        handleVariantSelect(item.id, variant)
                      }
                    />
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      className="text-white border-white bg-white/20 hover:bg-white/40"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={updatingItem === item.id}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-white text-lg">{item.quantity}</span>
                    <Button
                      variant="outline"
                      className="text-white border-white bg-white/20 hover:bg-white/40"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={updatingItem === item.id}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* REMOVE ITEM */}
                  <div className="mt-2 md:mt-0">
                    <Button
                      variant="ghost"
                      className="text-white hover:text-red-400"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Shipping & Total Summary */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-lg font-semibold">
                    Subtotal:
                  </span>
                  <span className="text-white text-lg">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white text-lg font-semibold">
                    Shipping:
                  </span>
                  <span className="text-white text-lg">
                    {shippingCost === 0
                      ? "FREE"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-white">
                    ${(totalPrice + shippingCost).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Truck className="w-6 h-6 text-white mr-2" />
                  <span className="text-white text-lg font-semibold">
                    {totalPrice >= freeShippingThreshold
                      ? "You've got FREE shipping!"
                      : "Free Shipping Progress"}
                  </span>
                </div>
                <Progress value={freeShippingProgress} className="h-2 mb-2" />
                {totalPrice < freeShippingThreshold && (
                  <p className="text-white text-sm">
                    Add ${amountNeededForFreeShipping.toFixed(2)} more to get
                    FREE shipping!
                  </p>
                )}
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-white text-purple-600 hover:bg-white/90 text-lg py-6"
              >
                Proceed to Checkout
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-white/70 mb-6">
              Explore our amazing products and add some to your cart!
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-white text-purple-600 hover:bg-white/90"
            >
              Start Shopping
            </Button>
          </motion.div>
        )}
      </div>

      {/* Image Modal for enlarged view */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={closeModal}
        imageUrl={modalImage || ""}
        alt="Enlarged view"
      />
    </div>
  );
}
