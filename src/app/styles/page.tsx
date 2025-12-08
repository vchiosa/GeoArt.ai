"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SelectionContext } from "../../context/SelectionContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { CustomInputCard } from "@/components/CustomInputCard";

interface SatelliteStyle {
  id: string;
  photoStyle: string;
  imageUrl: string;
}

export default function Styles() {
  const { styles, setStyles } = useContext(SelectionContext);
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>(styles || []);
  const [satelliteStyles, setSatelliteStyles] = useState<SatelliteStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSatelliteStyles() {
      try {
        const res = await fetch("/api/satellites");
        if (!res.ok) {
          throw new Error("Failed to fetch satellite styles");
        }
        const data: SatelliteStyle[] = await res.json();
        setSatelliteStyles(data);
      } catch (error) {
        console.error("Error fetching satellite styles:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSatelliteStyles();
  }, []);

  const toggleStyle = (style: string) => {
    if (selected.includes(style)) {
      setSelected(selected.filter((s) => s !== style));
    } else if (selected.length < 3) {
      setSelected([...selected, style]);
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      alert("Please select at least one style.");
      return;
    }
    setStyles(selected);
    router.push("/product");
  };

  const addCustomStyle = (style: string) => {
    // Add the new style to the selected styles.
    // Depending on your UX, you might also want to update the styles list.
    if (!selected.includes(style) && selected.length < 3) {
      setSelected([...selected, style]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl sm:text-5xl font-bold text-white text-center mb-2">
          Choose Your Art Styles
        </h1>
        <p className="text-lg sm:text-2xl text-white text-center mb-8">
          Select up to 3 styles for your GeoArt masterpiece
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-8 shadow-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
              >
                {/* Custom Input Card */}
                <CustomInputCard
                  placeholder="Add your own style..."
                  onSubmit={addCustomStyle}
                />
                {satelliteStyles.map((satellite) => (
                  <motion.div
                    key={satellite.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => toggleStyle(satellite.photoStyle)}
                      className={`relative w-full h-48 sm:h-40 p-0 overflow-hidden rounded-lg ${
                        selected.includes(satellite.photoStyle)
                          ? "ring-4 ring-white ring-opacity-70"
                          : ""
                      }`}
                      variant="ghost"
                    >
                      <Image
                        src={satellite.imageUrl || "/placeholder.svg"}
                        alt={`Example of ${satellite.photoStyle}`}
                        fill
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-2 sm:p-4">
                        <span className="text-white text-sm sm:text-lg font-semibold text-center leading-tight">
                          {satellite.photoStyle}
                        </span>
                      </div>
                      {selected.includes(satellite.photoStyle) && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2 bg-white text-black"
                        >
                          Selected
                        </Badge>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              onClick={handleSubmit}
              className="w-full bg-white text-purple-600 hover:bg-white/90"
              size="lg"
              disabled={selected.length === 0}
            >
              Continue with {selected.length} style
              {selected.length !== 1 ? "s" : ""}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
