"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { auth, db } from "@/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Header from "@/components/Header";

interface Order {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  productCategory: string;
  status: string;
  createdAt?: any;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const fetchedOrders: Order[] = [];
          querySnapshot.forEach((docSnap) => {
            fetchedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
          });
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <Header />
      <div className="max-w-4xl mx-auto p-4 sm:p-8 pt-20">
        <h1 className="text-3xl sm:text-5xl font-bold text-white text-center mb-8">
          My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="flex flex-col md:flex-row items-center justify-between py-4 border-b border-white/20 last:border-b-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  {/* Order Image */}
                  <div className="cursor-pointer">
                    <Image
                      src={order.imageUrl || "/placeholder.svg"}
                      alt={order.productName}
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                  </div>
                  {/* Order Details */}
                  <div>
                    <h3 className="text-white font-semibold">
                      {order.productName}
                    </h3>
                    <p className="text-white/70">
                      Category: {order.productCategory}
                    </p>
                    <p className="text-white/70">Quantity: {order.quantity}</p>
                    <p className="text-white/70">
                      Price: ${order.price.toFixed(2)}
                    </p>
                    <p className="text-white/70">Status: {order.status}</p>
                  </div>
                </div>
                {/* Order Date */}
                <div>
                  <p className="text-white/70 text-sm">
                    Order Date:{" "}
                    {order.createdAt
                      ? new Date(
                          order.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-4">
              You have no orders yet.
            </h2>
            <p className="text-white/70 mb-6">
              Browse our products and place an order to see them here.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-white text-purple-600 hover:bg-white/90 px-4 py-2 rounded-lg"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
