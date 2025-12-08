"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { auth, storage, ref, getDownloadURL, listAll } from "@/utils/firebase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ImageModal } from "@/components/ImageModal"; // Import ImageModal
import Header from "@/components/Header";

export default function MyDesigns() {
  const [designs, setDesigns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const imagesRef = ref(storage, `users/${user.uid}/dalle-images`);
          const result = await listAll(imagesRef);
          const urlPromises = result.items.map((imageRef) =>
            getDownloadURL(imageRef)
          );
          const imageUrls = await Promise.all(urlPromises);
          setDesigns(imageUrls);
        } catch (error) {
          console.error("Error fetching designs:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500">
      {/* Full-width Header */}
      <Header />

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl sm:text-5xl font-bold text-white text-center mb-8">
          My Designs
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : designs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {designs.map((design, index) => (
              <motion.div
                key={design}
                className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={design || "/placeholder.svg"}
                    alt={`Design ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <Button
                  onClick={() =>
                    router.push(
                      `/create-product?designUrl=${encodeURIComponent(design)}`
                    )
                  }
                  className="mt-2 w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition duration-300"
                >
                  Re-create Product
                </Button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-white">
            <p className="text-xl mb-4">You haven't created any designs yet.</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-white text-purple-600 hover:bg-white/90"
            >
              Create Your First Design
            </Button>
          </div>
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
