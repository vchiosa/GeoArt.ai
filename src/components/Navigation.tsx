import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthButton from "./AuthButton";
import { ShoppingCart } from "lucide-react";

export function Navigation() {
  return (
    <nav className="bg-white/10 backdrop-blur-lg fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold">
              GeoArt
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/my-designs" passHref>
              <Button variant="ghost" className="text-white">
                My Designs
              </Button>
            </Link>
            <Link href="/my-cart" passHref>
              <Button variant="ghost" className="text-white">
                <ShoppingCart className="mr-2 h-5 w-5" />
                My Cart
              </Button>
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
