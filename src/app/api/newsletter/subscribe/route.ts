import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Read existing subscribers or create empty list
    let subscribers = [];
    try {
      const fileData = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
      subscribers = JSON.parse(fileData);
    } catch (err) {
      // File doesn't exist, start empty
    }

    // Check if subscriber already exists
    const exists = subscribers.some((sub: any) => sub.email.toLowerCase() === email.toLowerCase());

    if (!exists) {
      const subscriber = {
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
      };
      subscribers.push(subscriber);
      await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed to newsletter" });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: error.message || "Failed to subscribe" }, { status: 500 });
  }
}
