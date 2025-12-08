"use client";

import { useRef, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import { ContactForm } from "@/components/ContactForm";
import { SelectionContext } from "../context/SelectionContext";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import {
  Coffee,
  Shirt,
  Smartphone,
  Layout,
  BedDouble,
  ShoppingBag,
  BedSingle,
  Star,
  Bolt,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

// Sample categories and products arrays
const categories = [
  { name: "Mugs", icon: Coffee },
  { name: "T-Shirts", icon: Shirt },
  { name: "Hoodies", icon: Shirt },
  { name: "Wall Art", icon: Layout },
  { name: "Sweatshirts", icon: Shirt },
  { name: "Pillows", icon: BedDouble },
  { name: "Tote Bags", icon: ShoppingBag },
  { name: "Phone Cases", icon: Smartphone },
  { name: "Blankets", icon: BedSingle },
  { name: "Ceramics", icon: Bolt, comingSoon: true },
];

// Replace this with your full product list or import from another file
const products: Product[] = [
  // Mugs
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

  // T-Shirts
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

  // Hoodies.
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

  // Wall Art
  {
    id: 28,
    name: "New York Skyline Wall Art",
    category: "Wall Art",
    price: 49.99,
    image: "/products/wallart-1.jpg",
  },
  // {
  //   id: 29,
  //   name: "Santorini Sunset Wall Art",
  //   category: "Wall Art",
  //   price: 49.99,
  //   image: "/products/wallart-2.jpg",
  // },

  // Sweatshirts
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

  // Pillows
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

  // Tote Bags
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

  // Phone Cases
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

  // Blankets
  {
    id: 73,
    name: "Aurora Borealis Blanket",
    category: "Blankets",
    price: 49.99,
    image: "/products/blanket-1.jpg",
  },
  // {
  //   id: 74,
  //   name: "Mount Fuji Sunrise Blanket",
  //   category: "Blankets",
  //   price: 49.99,
  //   image: "/products/blanket-2.jpg",
  // },
];

const features = [
  {
    title: "AI-Powered Designs",
    description: "Create unique artwork with advanced AI technology",
  },
  {
    title: "City-Inspired Art",
    description: "Capture the essence of your favorite cities",
  },
  {
    title: "Custom Products",
    description: "Apply your designs to a variety of high-quality products",
  },
  {
    title: "Easy to Use",
    description: "Intuitive interface for seamless creation process",
  },
];

const testimonials = [
  {
    name: "Sarah L.",
    comment:
      "GeoArt turned my travel memories into beautiful, wearable art. I love my custom t-shirt!",
    rating: 5,
  },
  {
    name: "Mike R.",
    comment:
      "The AI-generated designs are incredibly unique. My wall art is a conversation starter!",
    rating: 5,
  },
  {
    name: "Emily T.",
    comment:
      "Fast, easy, and amazing results. GeoArt is my go-to for personalized gifts.",
    rating: 4,
  },
];

// ProductCarousel Component
function ProductCarousel({ products }: { products: Product[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, []);

  return (
    <motion.div ref={carouselRef} className="overflow-hidden cursor-grab">
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        className="flex space-x-6"
      >
        {products.map((product: Product) => (
          <motion.div
            key={product.id}
            className="min-w-[280px] bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-4"
          >
            <div className="relative h-48 w-full">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-white">
                {product.name}
              </h3>
              <p className="text-white/80">${product.price.toFixed(2)}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { setProductCategory } = useContext(SelectionContext);
  const router = useRouter();
  const { user } = useAuth();

  const handleCategorySelect = (category: string) => {
    if (!user) {
      router.push("/auth");
    } else {
      setProductCategory(category);
      router.push("/countries");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        {/* <nav className="flex justify-between items-center py-6">
          <Image src="/logo.png" alt="GeoArt Logo" width={72} height={24} />
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push("/my-designs")}
              variant="outline"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              My Designs
            </Button>
            <Button
              onClick={() => router.push("/my-cart")}
              variant="outline"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              My Cart
            </Button>
            <AuthButton />
          </div>
        </nav> */}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Unique Souvenirs, Created in Seconds
          </h1>
          <p className="text-xl text-white mb-8">
            Effortlessly produce AI-driven art of famous locations for
            unforgettable products.
          </p>

          <Button
            onClick={() => router.push("/auth")}
            size="lg"
            className="bg-white text-blue-600 hover:bg-white/90"
          >
            Try It Free
          </Button>
        </motion.div>

        {/* Product Carousel Section */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Explore Our Featured Products
          </h2>
          <ProductCarousel products={products} />
        </section>

        {/* Features Section */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose GeoArt?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Create a Product
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
                  onClick={() =>
                    !cat.comingSoon && handleCategorySelect(cat.name)
                  }
                  className={`w-full h-32 flex flex-col items-center justify-center space-y-2 border-2 border-white/30 transition-all duration-300 ${
                    cat.comingSoon
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                  variant="ghost"
                  disabled={cat.comingSoon}
                >
                  <cat.icon className="h-8 w-8" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </Button>

                {/* "Coming Soon" badge */}
                {cat.comingSoon && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mock-up Showcase */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            See Your Designs Come to Life
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Image
              src="/mockups/mockup-tshirt.jpg"
              alt="T-Shirt Mockup"
              width={400}
              height={400}
              className="rounded-lg"
            />
            <Image
              src="/mockups/mockup-mug.jpg"
              alt="Mug Mockup"
              width={400}
              height={400}
              className="rounded-lg"
            />
            <Image
              src="/mockups/mockup-poster.jpg"
              alt="Poster Mockup"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white"
              >
                <p className="mb-4">"{testimonial.comment}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{testimonial.name}</span>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Get in Touch
          </h2>
          <ContactForm />
        </section>

        {/* Call to Action */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your Own GeoArt?
          </h2>
          <p className="text-xl text-white mb-8">
            Turn your travel memories into stunning, personalized products
            today!
          </p>
          <Button
            onClick={() => router.push("/auth")}
            size="lg"
            className="bg-white text-blue-600 hover:bg-white/90"
          >
            Start Designing Now
          </Button>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-white">
          <p>&copy; 2023 GeoArt. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
