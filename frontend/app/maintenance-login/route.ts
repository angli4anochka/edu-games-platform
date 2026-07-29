import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  const expectedUsername = process.env.MAINTENANCE_USERNAME ?? "";
  const expectedPassword = process.env.MAINTENANCE_PASSWORD ?? "";
  const secret = process.env.MAINTENANCE_SECRET ?? "";
  if (!secret || !safeEqual(username, expectedUsername) || !safeEqual(password, expectedPassword)) return NextResponse.json({ ok: false }, { status: 401 });
  const token = createHmac("sha256", secret).update("maintenance-access").digest("hex");
  const response = NextResponse.json({ ok: true });
  response.cookies.set("maintenance_access", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 2592000, path: "/" });
  return response;
}
