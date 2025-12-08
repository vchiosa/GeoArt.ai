"use client";

import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  alt,
}: ImageModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-5xl w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square relative overflow-hidden">
              <motion.div
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full h-full"
              >
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={alt}
                  layout="fill"
                  objectFit="contain"
                  className="select-none"
                  draggable={false}
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 right-4 flex space-x-2"
            >
              <button
                onClick={toggleZoom}
                className="bg-white/10 backdrop-blur-md text-white rounded-full p-2 hover:bg-white/20 transition-colors duration-200"
              >
                {isZoomed ? (
                  <ZoomOut className="h-6 w-6" />
                ) : (
                  <ZoomIn className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={onClose}
                className="bg-white/10 backdrop-blur-md text-white rounded-full p-2 hover:bg-white/20 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4"
            >
              <p className="text-white text-center text-sm md:text-base">
                {alt}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
