import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, avatar } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Read existing users or create empty list
    let users = [];
    try {
      const fileData = await fs.readFile(USERS_FILE, "utf-8");
      users = JSON.parse(fileData);
    } catch (err) {
      // File doesn't exist, start with empty list
    }

    // Check if user already exists
    let user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        email,
        name: name || email.split("@")[0],
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Failed to sign up" }, { status: 500 });
  }
}
