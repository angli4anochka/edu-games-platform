import type { Metadata } from "next";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { PublicAccessGate } from "@/components/PublicAccessGate";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: "Сайт временно недоступен", description: "Зайдите позже" };

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const secret = process.env.MAINTENANCE_SECRET ?? "";
  const expectedToken = secret ? createHmac("sha256", secret).update("maintenance-access").digest("hex") : "";
  const suppliedToken = (await cookies()).get("maintenance_access")?.value ?? "";
  const hasAccess = Boolean(secret && safeEqual(suppliedToken, expectedToken));
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{hasAccess ? children : <PublicAccessGate>{children}</PublicAccessGate>}</body>
    </html>
  );
}

