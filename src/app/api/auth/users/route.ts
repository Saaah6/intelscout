import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export async function GET() {
  try {
    // Ensure directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    let users = [];
    try {
      const fileData = await fs.readFile(USERS_FILE, "utf-8");
      users = JSON.parse(fileData);
    } catch (err) {
      // File doesn't exist yet, return empty list
    }

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 });
  }
}
