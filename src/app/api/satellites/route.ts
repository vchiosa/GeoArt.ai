// /api/satellites/route.ts
import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase"; // ✅ Use Firestore instance from firebase.ts

export async function GET() {
  try {
    // ✅ Correct Firestore query syntax
    const querySnapshot = await getDocs(collection(db, "satellite"));

    // ✅ Ensure doc has a proper type to avoid TypeScript issues
    const satelliteData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        photoStyle: data.photoStyle || "Unknown Style",
        imageUrl: data.examplePhotos?.[0] || "/placeholder.svg", // ✅ Return first image
      };
    });

    return NextResponse.json(satelliteData);
  } catch (error) {
    console.error("🔥 Error fetching satellite data:", error);
    return new NextResponse("Error fetching satellite data", { status: 500 });
  }
}
