// components/CustomInputCard.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle, X } from "lucide-react";

interface CustomInputCardProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  title?: string;
  description?: string;
  icon?: "plus" | "search";
}

export function CustomInputCard({
  placeholder,
  onSubmit,
  title = "Can't find what you're looking for?",
  description = "Add a custom entry if it's not in our list",
  icon = "plus",
}: CustomInputCardProps) {
  const [value, setValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setIsSubmitted(true);

      // Reset after showing success animation
      setTimeout(() => {
        setValue("");
        setIsSubmitted(false);
      }, 1500);
    }
  };

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const IconComponent = icon === "plus" ? Plus : Search;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl bg-indigo-900/80 backdrop-blur-lg border border-indigo-700 shadow-xl w-full max-w-md mx-auto"
    >
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />

      <div className="p-4 sm:p-5">
        <div className="flex items-start mb-4">
          <div className="bg-indigo-700/80 rounded-full p-2 mr-3 flex-shrink-0">
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg">
              {title}
            </h3>
            <p className="text-indigo-200 text-xs sm:text-sm">{description}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  className="bg-indigo-800/70 border-indigo-600 text-white placeholder-indigo-300 pr-10 h-10"
                />
                {value.trim() && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setValue("")}
                      className="h-7 w-7 rounded-full text-indigo-300 hover:text-white hover:bg-indigo-700"
                    >
                      <span className="sr-only">Clear</span>
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className="w-full bg-white text-indigo-700 hover:bg-indigo-100 transition-all duration-300 font-medium h-10"
              >
                <IconComponent className="mr-2 h-4 w-4" />
                {icon === "plus" ? "Add Custom Entry" : "Search"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="h-12 w-12 text-green-400 mb-2" />
              </motion.div>
              <p className="text-white font-medium text-center">
                Successfully added!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
