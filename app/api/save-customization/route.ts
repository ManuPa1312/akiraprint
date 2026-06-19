import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const { imageData } = await req.json();

  const result = await cloudinary.uploader.upload(imageData, {
    folder: "akiraprint/customizations",
    quality: "auto",
    fetch_format: "auto",
    transformation: [
      { quality: 80 },
    ],
  });

  return NextResponse.json({ url: result.secure_url });
}