import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

export async function GET() {
  try {
    // Ensure directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    let subscribers = [];
    try {
      const fileData = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
      subscribers = JSON.parse(fileData);
    } catch (err) {
      // File doesn't exist yet, return empty list
    }

    return NextResponse.json({ success: true, subscribers });
  } catch (error: any) {
    console.error("Fetch subscribers error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch subscribers" }, { status: 500 });
  }
}
