import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CountryCardProps {
  country: string;
  imageUrl: string;
  onSelect: (country: string) => void;
}

export function CountryCard({ country, imageUrl, onSelect }: CountryCardProps) {
  // State to track whether the image is still loading
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(country)}
    >
      {/* 🔹 Image itself */}
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={`Image of ${country}`}
        layout="fill"
        objectFit="cover"
        priority={false}
        loading="lazy"
        // Fade in the image once loading is complete
        className={`transition-opacity duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />

      {/* 🔹 Shimmer / Skeleton Loader (only visible while loading) */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      )}

      {/* 🔹 Gradient overlay & Country Label */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: imageUrl ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-white text-lg font-semibold text-center">
          {country}
        </span>
      </motion.div>
    </motion.div>
  );
}
