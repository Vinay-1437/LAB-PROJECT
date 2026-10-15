import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import { connectDB } from "../config/db.js";

dotenv.config();

export const initialProducts = [
  {
    name: "Mechanical Keyboard",
    description: "RGB backlight tactile mechanical gaming and typing keyboard with custom blue switches.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    stock: 15
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation and 40-hour battery life.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    stock: 25
  },
  {
    name: "Wireless Optical Mouse",
    description: "Ergonomic 2.4GHz wireless mouse with adjustable DPI and silent clicks.",
    price: 1499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
    stock: 30
  },
  {
    name: "Smart Fitness Watch",
    description: "Waterproof fitness tracker with AMOLED display, heart rate monitor and sleep tracking.",
    price: 3499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    stock: 20
  },
  {
    name: "Classic Denim Jacket",
    description: "Premium washed cotton denim trucker jacket with button closure.",
    price: 2499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
    stock: 18
  },
  {
    name: "Urban Canvas Backpack",
    description: "Water-resistant commuter backpack with 15.6 inch padded laptop compartment.",
    price: 1899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    stock: 22
  },
  {
    name: "Stainless Steel Coffee Tumbler",
    description: "Double-walled vacuum insulated thermal travel mug keeps drinks hot for 12 hours.",
    price: 999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    stock: 40
  },
  {
    name: "Designing Data-Intensive Applications",
    description: "The definitive guide to distributed system architectures, databases and streaming.",
    price: 1299,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    stock: 12
  }
];

export const autoSeedIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("[Seed] Products collection is empty. Seeding initial catalog...");
      await Product.insertMany(initialProducts);
      console.log(`[Seed] Seeded ${initialProducts.length} products successfully.`);
    }
  } catch (err) {
    console.warn("[Seed] Auto-seed error:", err.message);
  }
};

if (process.argv[1]?.endsWith("seedProducts.js")) {
  (async () => {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    console.log("Database reset and re-seeded successfully!");
    process.exit(0);
  })();
}
