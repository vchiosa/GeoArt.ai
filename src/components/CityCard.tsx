import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { fetchCityImage } from "@/utils/fetchCityImage";

interface CityCardProps {
  city: string;
  country: string; // Added country for proper storage path
  isHot: boolean;
  onSelect: (city: string) => void;
}

// Helper: Returns alternate search terms for a given iconic place
function getAlternateQueries(city: string): string[] {
  const mapping: { [key: string]: string[] } = {
    // Landmarks
    "Statue of Liberty": ["Liberty Enlightening the World"],
    "Eiffel Tower": ["La Tour Eiffel"],
    "Great Wall of China": [],
    "Taj Mahal": [],
    "Pyramids of Giza": ["Egyptian Pyramids", "Giza Pyramids"],
    "Christ the Redeemer": ["Cristo Redentor", "Christ Redeemer"],
    Colosseum: ["Flavian Amphitheatre", "Rome Colosseum"],
    "Big Ben": ["Elizabeth Tower"],
    "Sydney Opera House": ["Opera House Sydney"],
    "Machu Picchu": ["Inca Citadel"],
    "Burj Khalifa": ["Dubai Tower"],
    "Angkor Wat": [],
    "Leaning Tower of Pisa": ["Torre Pendente"],
    "Sagrada Familia": ["Basilica of the Sagrada Família"],
    "Mount Rushmore": ["Rushmore National Memorial"],
    "Palace of Versailles": ["Château de Versailles"],
    "Neuschwanstein Castle": ["Schloss Neuschwanstein"],
    "Acropolis of Athens": ["The Acropolis"],
    "Brandenburg Gate": ["Brandenburger Tor"],
    "Kremlin and Red Square": [],

    // Beautiful Nature Scenes
    "Grand Canyon": ["The Grand Canyon"],
    "Aurora Borealis": ["Northern Lights"],
    "Niagara Falls": [],
    "Banff National Park": [],
    "Yosemite National Park": ["Yosemite"],
    "Mount Everest Base Camp": ["Everest Base Camp"],
    "Sahara Desert": ["Saharan Desert"],
    "Amazon Rainforest": ["Amazon Jungle"],
    "Lake Louise": [],
    "Antelope Canyon": [],
    "Plitvice Lakes": [],
    "Iguazu Falls": ["Iguassu Falls"],
    "Victoria Falls": [],
    "Milford Sound": [],
    "Zhangjiajie National Forest": ["Zhangjiajie National Forest Park"],
    "Halong Bay": [],
    "Torres del Paine": ["Torres del Paine National Park"],
    "The Dolomites": [],
    "The Blue Lagoon": ["Blue Lagoon Iceland"],
    "Okavango Delta": [],

    // City-Specific Icons
    "Golden Gate Bridge": [],
    "Tokyo Skytree": [],
    "Tokyo Sakura": ["Tokyo Cherry Blossoms"],
    "Empire State Building": [],
    "CN Tower": [],
    "Sydney Harbour Bridge": [],
    "London Tower Bridge": [],
    "Shibuya Crossing": [],
    "Space Needle": [],
    "Cloud Gate": ["The Bean"],
    "La Sagrada Familia": ["Sagrada Família"],
    "Piazza San Marco": [],
    "Burj Al Arab": ["Al Arab Tower"],
    "Dubai Fountain": [],
    "Times Square": [],
    "Louvre Pyramid": [],
    "Rialto Bridge": [],
    "Arc de Triomphe": [],
    "Gateway of India": [],
    "Puente de la Mujer": [],
  };

  return mapping[city] || [];
}

export function CityCard({ city, country, isHot, onSelect }: CityCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      try {
        // 1️⃣ Try to fetch the compressed city image from Firebase Storage
        let url = await fetchCityImage(country, city);

        // 2️⃣ If Firebase image is not available, fallback to Wikipedia
        if (!url) {
          // Prepare a list of queries: primary name and alternate names
          const queries = [city, ...getAlternateQueries(city)];

          // Optionally, choose Wikipedia language based on the country
          const lang = country === "Brazil" ? "pt" : "en";

          for (const queryTerm of queries) {
            const response = await fetch(
              `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
                queryTerm
              )}&prop=pageimages&pithumbsize=600&format=json&origin=*`
            );
            const data = await response.json();
            const pages = data.query?.pages;
            if (pages) {
              const page = Object.values(pages)[0] as any;
              if (page.thumbnail?.source) {
                url = page.thumbnail.source;
                break; // Exit loop once an image is found
              }
            }
          }
        }

        setImageUrl(url || "/placeholder.svg");
      } catch (error) {
        console.error("Error fetching city image:", error);
        setImageUrl("/placeholder.svg");
      } finally {
        setIsLoading(false);
      }
    }

    fetchImage();
  }, [city, country]);

  return (
    <motion.div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(city)}
    >
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={`Image of ${city}`}
        layout="fill"
        objectFit="cover"
        priority={false}
        loading="lazy"
        className={`transition-all duration-700 ${
          isLoading ? "opacity-0 scale-110" : "opacity-100 scale-100"
        } group-hover:scale-110`}
        onLoadingComplete={() => setIsLoading(false)}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      )}

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col items-center justify-end p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-white text-xl font-bold text-center mb-2">
          {city}
        </span>
        {isHot && (
          <Badge variant="secondary" className="bg-red-500 text-white">
            <Flame className="w-4 h-4 mr-1" /> Hot Destination
          </Badge>
        )}
      </motion.div>
    </motion.div>
  );
}
