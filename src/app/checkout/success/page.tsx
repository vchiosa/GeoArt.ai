"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";

export default function CheckoutSuccess() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    // Generate a random order number (in a real app, this would come from your backend)
    setOrderNumber(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, []);

  const steps = [
    { icon: CheckCircle, text: "Order Confirmed" },
    { icon: Package, text: "Processing" },
    { icon: Truck, text: "Shipping Soon" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4 sm:p-8 flex items-center justify-center">
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-white/80">
            Your GeoArt creation is on its way.
          </p>
        </div>

        <div className="bg-white/20 rounded-lg p-6 mb-8">
          <p className="text-white text-lg mb-2">
            Order Number: <span className="font-bold">{orderNumber}</span>
          </p>
          <p className="text-white/80">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            What's Next?
          </h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.text}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <step.icon className="w-8 h-8 text-white" />
                <span className="text-white text-lg">{step.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={() => router.push("/my-designs")}
            className="bg-white text-blue-600 hover:bg-white/90"
          >
            View My Designs
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="text-white border-white hover:bg-white/20"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
