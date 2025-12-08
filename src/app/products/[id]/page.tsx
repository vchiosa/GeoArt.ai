"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Star,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageModal } from "@/components/ImageModal";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";

// You can import your products from a shared file if needed
const products = [
  // Mugs
  {
    id: 1,
    name: "New York Skyline Mug",
    category: "Mugs",
    price: 14.99,
    image: "/products/mug-1.jpg",
    description:
      "Start your day with a view of the iconic New York skyline. This ceramic mug features a stunning AI-generated design of the Manhattan skyline at sunset.",
    features: [
      "11oz ceramic mug",
      "Dishwasher and microwave safe",
      "Vibrant, fade-resistant print",
      "Comfortable handle",
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    additionalImages: [],
  },
  {
    id: 2,
    name: "Paris Eiffel Tower Mug",
    category: "Mugs",
    price: 14.99,
    image: "/products/mug-2.jpg",
    description:
      "Bring the romance of Paris to your coffee break with this elegant mug featuring the Eiffel Tower against a beautiful sunset backdrop.",
    features: [
      "11oz ceramic mug",
      "Dishwasher and microwave safe",
      "Vibrant, fade-resistant print",
      "Comfortable handle",
    ],
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    additionalImages: [],
  },

  // T-Shirts
  {
    id: 10,
    name: "New York Skyline T-Shirt",
    category: "T-Shirts",
    price: 24.99,
    image: "/products/tshirt-1.jpg",
    description:
      "Show your love for the Big Apple with this comfortable cotton t-shirt featuring a stunning AI-generated design of the New York skyline.",
    features: [
      "100% premium cotton",
      "Unisex fit",
      "Available in sizes S-XXL",
      "Machine washable",
    ],
    rating: 4.9,
    reviewCount: 215,
    inStock: true,
    additionalImages: [],
  },
  {
    id: 11,
    name: "Tokyo Sakura T-Shirt",
    category: "T-Shirts",
    price: 24.99,
    image: "/products/tshirt-2.jpg",
    description:
      "Experience the beauty of Tokyo's cherry blossom season year-round with this artistic t-shirt featuring an AI-generated design of sakura trees in bloom.",
    features: [
      "100% premium cotton",
      "Unisex fit",
      "Available in sizes S-XXL",
      "Machine washable",
    ],
    rating: 4.7,
    reviewCount: 183,
    inStock: true,
    additionalImages: [],
  },

  // Hoodies
  {
    id: 19,
    name: "New York Skyline Hoodie",
    category: "Hoodies",
    price: 39.99,
    image: "/products/hoodie-1.jpg",
    description:
      "Stay warm while showcasing the iconic New York skyline with this comfortable hoodie featuring an AI-generated design of Manhattan at night.",
    features: [
      "80% cotton, 20% polyester",
      "Unisex fit",
      "Available in sizes S-XXL",
      "Front pocket and adjustable hood",
    ],
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    additionalImages: [],
  },
  {
    id: 20,
    name: "London Big Ben Hoodie",
    category: "Hoodies",
    price: 39.99,
    image: "/products/hoodie-2.jpg",
    description:
      "Bring a piece of London with you wherever you go with this stylish hoodie featuring an AI-generated design of Big Ben and the Thames.",
    features: [
      "80% cotton, 20% polyester",
      "Unisex fit",
      "Available in sizes S-XXL",
      "Front pocket and adjustable hood",
    ],
    rating: 4.6,
    reviewCount: 142,
    inStock: true,
    additionalImages: [],
  },

  // Wall Art
  {
    id: 28,
    name: "New York Skyline Wall Art",
    category: "Wall Art",
    price: 49.99,
    image: "/products/wallart-1.jpg",
    description:
      "Transform your space with this stunning AI-generated wall art featuring the New York skyline at sunset. Printed on premium canvas for a gallery-quality finish.",
    features: [
      "Premium canvas print",
      "Wooden frame included",
      "Available in multiple sizes",
      "Ready to hang",
    ],
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    additionalImages: [],
  },

  // Sweatshirts
  {
    id: 37,
    name: "New York Skyline Sweatshirt",
    category: "Sweatshirts",
    price: 34.99,
    image: "/products/sweatshirt-1.jpg",
    description:
      "Stay cozy with this comfortable sweatshirt featuring an AI-generated design of the New York skyline. Perfect for casual outings or relaxing at home.",
    features: [
      "70% cotton, 30% polyester",
      "Unisex fit",
      "Available in sizes S-XXL",
      "Ribbed cuffs and hem",
    ],
    rating: 4.7,
    reviewCount: 112,
    inStock: true,
    additionalImages: [],
  },
  {
    id: 38,
    name: "Rome Colosseum Sweatshirt",
    category: "Sweatshirts",
    price: 34.99,
    image: "/products/sweatshirt-2.jpg",
    description:
      "Celebrate the eternal city with this stylish sweatshirt featuring an AI-generated design of the Colosseum. A perfect blend of comfort and historical elegance.",
    features: [
      "70% cotton, 30% polyester",
      "Unisex fit",
      "Available in sizes S-XXL",
      "Ribbed cuffs and hem",
    ],
    rating: 4.6,
    reviewCount: 98,
    inStock: true,
    additionalImages: [],
  },

  // Pillows
  {
    id: 46,
    name: "Barcelona Sagrada Familia Pillow",
    category: "Pillows",
    price: 19.99,
    image: "/products/pillow-1.jpg",
    description:
      "Add a touch of Barcelona's architectural wonder to your home with this soft pillow featuring an AI-generated design of the Sagrada Familia.",
    features: [
      "100% polyester cover",
      "Soft polyester filling",
      '18" x 18" size',
      "Hidden zipper closure",
    ],
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    additionalImages: [],
  },
  {
    id: 47,
    name: "Venice Grand Canal Pillow",
    category: "Pillows",
    price: 19.99,
    image: "/products/pillow-2.jpg",
    description:
      "Bring the romance of Venice into your home with this decorative pillow featuring an AI-generated design of the Grand Canal at sunset.",
    features: [
      "100% polyester cover",
      "Soft polyester filling",
      '18" x 18" size',
      "Hidden zipper closure",
    ],
    rating: 4.7,
    reviewCount: 68,
    inStock: true,
    additionalImages: [],
  },

  // Tote Bags
  {
    id: 55,
    name: "Amsterdam Canals Tote Bag",
    category: "Tote Bags",
    price: 24.99,
    image: "/products/totebag-1.jpg",
    description:
      "Carry your essentials in style with this durable tote bag featuring an AI-generated design of Amsterdam's picturesque canals.",
    features: [
      "100% cotton canvas",
      "Reinforced handles",
      "Interior pocket",
      "Machine washable",
    ],
    rating: 4.8,
    reviewCount: 92,
    inStock: true,
    additionalImages: [],
  },
  {
    id: 56,
    name: "Sydney Opera House Tote Bag",
    category: "Tote Bags",
    price: 24.99,
    image: "/products/totebag-2.jpg",
    description:
      "Show your love for Sydney with this stylish tote bag featuring an AI-generated design of the iconic Opera House against a vibrant harbor backdrop.",
    features: [
      "100% cotton canvas",
      "Reinforced handles",
      "Interior pocket",
      "Machine washable",
    ],
    rating: 4.7,
    reviewCount: 84,
    inStock: true,
    additionalImages: [],
  },

  // Phone Cases
  {
    id: 64,
    name: "San Francisco Golden Gate Phone Case",
    category: "Phone Cases",
    price: 29.99,
    image: "/products/phonecase-1.jpg",
    description:
      "Protect your phone with this durable case featuring an AI-generated design of the Golden Gate Bridge shrouded in San Francisco's famous fog.",
    features: [
      "Durable polycarbonate material",
      "Shock-absorbing edges",
      "Available for iPhone and Android models",
      "Wireless charging compatible",
    ],
    rating: 4.9,
    reviewCount: 128,
    inStock: true,
    additionalImages: [],
  },
  {
    id: 65,
    name: "Dubai Skyline Phone Case",
    category: "Phone Cases",
    price: 29.99,
    image: "/products/phonecase-2.jpg",
    description:
      "Add a touch of luxury to your phone with this sleek case featuring an AI-generated design of Dubai's futuristic skyline at night.",
    features: [
      "Durable polycarbonate material",
      "Shock-absorbing edges",
      "Available for iPhone and Android models",
      "Wireless charging compatible",
    ],
    rating: 4.8,
    reviewCount: 116,
    inStock: true,
    additionalImages: [],
  },

  // Blankets
  {
    id: 73,
    name: "Aurora Borealis Blanket",
    category: "Blankets",
    price: 49.99,
    image: "/products/blanket-1.jpg",
    description:
      "Wrap yourself in the magic of the Northern Lights with this soft, warm blanket featuring an AI-generated design of the Aurora Borealis over a snowy landscape.",
    features: [
      "Super soft microfiber material",
      '50" x 60" size',
      "Machine washable",
      "Vibrant, fade-resistant print",
    ],
    rating: 4.9,
    reviewCount: 104,
    inStock: true,
    additionalImages: [],
  },
];

// Sample reviews for demonstration
const sampleReviews = [
  {
    id: 1,
    name: "Sarah L.",
    rating: 5,
    date: "October 15, 2023",
    comment:
      "Absolutely love this product! The design is even more beautiful in person, and the quality is excellent.",
  },
  {
    id: 2,
    name: "Michael R.",
    rating: 4,
    date: "September 28, 2023",
    comment:
      "Great product overall. The colors are vibrant and the design is stunning. Shipping was fast too!",
  },
  {
    id: 3,
    name: "Emily T.",
    rating: 5,
    date: "November 3, 2023",
    comment:
      "This makes such a perfect gift! My friend was thrilled with the unique design and quality.",
  },
];

export default function ProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(new Set<number>());
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<typeof products>([]);
  const [cartLoading, setCartLoading] = useState<number | null>(null);

  // Find the product by matching the id from the URL
  const product = products.find((p) => String(p.id) === id);

  useEffect(() => {
    if (product) {
      // Find related products in the same category
      const related = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4); // Limit to 4 related products
      setRelatedProducts(related);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.push("/featured-products")}
            className="bg-white text-blue-600 hover:bg-white/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  // Use placeholder images if additionalImages is not available
  const allImages = [
    product.image,
    ...(product.additionalImages || [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ]),
  ];

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (addedToCart.has(product.id)) return; // Prevent duplicate adds

    setCartLoading(product.id);

    try {
      await addDoc(collection(db, "carts"), {
        userId: user.uid,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.image,
        productCategory: product.category,
        createdAt: serverTimestamp(),
      });

      console.log(`✅ Added ${quantity} of ${product.name} to cart`);
      setAddedToCart((prev) => new Set(prev).add(product.id)); // Update added state
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    } finally {
      setCartLoading(null);
    }
  };

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-white mb-6">
          <Button
            variant="link"
            className="text-white p-0 mr-2"
            onClick={() => router.push("/featured-products")}
          >
            Products
          </Button>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Button
            variant="link"
            className="text-white p-0 mr-2"
            onClick={() =>
              router.push(`/featured-products?category=${product.category}`)
            }
          >
            {product.category}
          </Button>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-white/70">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-8 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <motion.div
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleImageClick(activeImageIndex)}
              >
                <Image
                  src={allImages[activeImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Thumbnail Gallery */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                      activeImageIndex === index ? "ring-2 ring-white" : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="text-white">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="bg-blue-500 text-white mb-2">
                    {product.category}
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-white/80">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <p className="text-3xl font-bold mb-4">
                ${product.price.toFixed(2)}
              </p>

              <p className="mb-6 text-white/90">{product.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-white/90">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <span
                  className={`font-semibold ${
                    product.inStock ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="mr-4">Quantity:</span>
                <div className="flex items-center border border-white/30 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-none rounded-l-md"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-none rounded-r-md"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="w-full bg-white text-blue-600 hover:bg-white/90 py-6"
                onClick={handleAddToCart}
                disabled={
                  addedToCart.has(product.id) || cartLoading === product.id
                }
              >
                {cartLoading === product.id
                  ? "Loading..."
                  : addedToCart.has(product.id)
                  ? "✅ Added!"
                  : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-8 shadow-xl mb-8">
          <Tabs defaultValue="description">
            <TabsList className="bg-white/20 text-white">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-white mt-4">
              <h3 className="text-xl font-semibold mb-4">
                Product Description
              </h3>
              <p className="mb-4">{product.description}</p>
              <p>
                Our AI-generated designs capture the essence and beauty of
                iconic locations around the world. Each product is carefully
                crafted to ensure the highest quality and customer satisfaction.
              </p>
            </TabsContent>
            <TabsContent value="reviews" className="text-white mt-4">
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {sampleReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-white/20 pb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{review.name}</h4>
                      <span className="text-sm text-white/70">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-white/90">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="text-white mt-4">
              <h3 className="text-xl font-semibold mb-4">
                Shipping Information
              </h3>
              <p className="mb-4">
                We ship worldwide with the following options:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Standard Shipping: 5-7 business days</li>
                <li>Express Shipping: 2-3 business days</li>
                <li>Free shipping on orders over $50</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4">Return Policy</h3>
              <p>
                If you're not completely satisfied with your purchase, you can
                return it within 30 days for a full refund. Items must be unused
                and in their original packaging.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <div
                    className="relative h-48 cursor-pointer"
                    onClick={() =>
                      router.push(`/products/${relatedProduct.id}`)
                    }
                  >
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-lg font-semibold text-white mb-2 cursor-pointer hover:underline"
                      onClick={() =>
                        router.push(`/products/${relatedProduct.id}`)
                      }
                    >
                      {relatedProduct.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">
                        ${relatedProduct.price.toFixed(2)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-800 border-gray-300 hover:bg-gray-100"
                        onClick={() =>
                          router.push(`/products/${relatedProduct.id}`)
                        }
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={allImages[activeImageIndex] || "/placeholder.svg"}
        alt={product.name}
      />
    </div>
  );
}
