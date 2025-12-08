"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ShoppingCart } from "lucide-react";

export default function CheckoutCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-purple-500 p-4 sm:p-8 flex items-center justify-center">
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
            <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Checkout Cancelled
          </h1>
          <p className="text-xl text-white/80">
            Your order has not been processed.
          </p>
        </div>

        <div className="bg-white/20 rounded-lg p-6 mb-8">
          <p className="text-white text-lg mb-2">We're sorry to see you go!</p>
          <p className="text-white/80">
            If you experienced any issues during checkout or have any questions,
            please don't hesitate to contact our support team.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            What would you like to do next?
          </h2>
          <motion.ul
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {[
              {
                text: "Return to your cart",
                action: () => router.push("/my-cart"),
              },
              { text: "Continue shopping", action: () => router.push("/") },
              {
                text: "View your designs",
                action: () => router.push("/my-designs"),
              },
            ].map((item, index) => (
              <motion.li
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <Button
                  onClick={item.action}
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {item.text}
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="text-center">
          <Button
            onClick={() => router.push("/my-cart")}
            className="bg-white text-purple-600 hover:bg-white/90"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Return to Cart
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
