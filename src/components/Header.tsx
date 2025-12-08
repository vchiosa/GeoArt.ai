"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import {
  Menu,
  X,
  ShoppingCart,
  Palette,
  Package,
  Search,
  Home,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Sample navigation items
  const navItems: NavItem[] = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    {
      name: "My Designs",
      path: "/my-designs",
      icon: <Palette className="w-4 h-4" />,
    },
    {
      name: "Featured",
      path: "/featured-products",
      icon: <Star className="w-4 h-4" />,
    },
    {
      name: "My Orders",
      path: "/my-orders",
      icon: <Package className="w-4 h-4" />,
    },
  ];

  // Listen to scroll for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch real cart count from Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const cartRef = collection(db, "carts");
          const q = query(cartRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          setCartCount(querySnapshot.size);
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-blue-800/95 via-indigo-700/95 to-purple-700/95 backdrop-blur-md shadow-lg py-2"
          : "bg-gradient-to-r from-blue-800/80 via-indigo-700/80 to-purple-700/80 backdrop-blur-sm py-3"
      }`}
    >
      {/* Inner container for content alignment */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Image
              src="/logo.png"
              alt="GeoArt Logo"
              width={120}
              height={36}
              className="h-10 w-auto"
            />
          </motion.div>
        </div>

        {/* Desktop Navigation (Centered) */}
        {!isMobile && (
          <>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  variant="ghost"
                  className={`text-white hover:bg-white/20 transition duration-300 ${
                    pathname === item.path ? "bg-white/20 font-medium" : ""
                  }`}
                  size="sm"
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Button>
              ))}
            </div>

            {/* Cart and Auth Button (Right Side) */}
            <div className="flex items-center space-x-2">
              {/* Cart Button with Badge */}
              <Button
                onClick={() => router.push("/my-cart")}
                variant="ghost"
                className="text-white hover:bg-white/20 transition duration-300 relative"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Auth Button */}
              <AuthButton />
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center space-x-2">
            {/* Cart Icon with Badge */}
            <Button
              onClick={() => router.push("/my-cart")}
              variant="ghost"
              className="text-white hover:bg-white/20 transition duration-300 relative"
              size="icon"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              className="text-white hover:bg-white/20 transition duration-300"
              size="icon"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-b from-indigo-800/95 to-purple-900/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      router.push(item.path);
                      setMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className={`w-full justify-start text-white hover:bg-white/20 transition duration-300 ${
                      pathname === item.path ? "bg-white/10 font-medium" : ""
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="pt-2 border-t border-white/10"
              >
                <div className="flex justify-center">
                  <AuthButton />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
