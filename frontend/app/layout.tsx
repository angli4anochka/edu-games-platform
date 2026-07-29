import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Сайт временно недоступен",
  description: "Зайдите позже",
};

export default function RootLayout({
  children: _children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <main
          className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.13), transparent 32%), radial-gradient(circle at 80% 75%, rgba(255,180,90,.18), transparent 35%), linear-gradient(135deg, #321b12 0%, #6f321f 48%, #b64f25 100%)",
          }}
        >
          <div aria-hidden="true" className="absolute -left-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full border border-white/10" />
          <section className="relative z-10 max-w-4xl">
            <div className="mb-8 text-7xl sm:text-8xl" aria-hidden="true">🦖</div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Громари съел сайт
            </h1>
            <p className="mt-6 text-xl font-medium text-orange-100 sm:text-3xl">Заходите позже</p>
          </section>
        </main>
      </body>
    </html>
  );
}

