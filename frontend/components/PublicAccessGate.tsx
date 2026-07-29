"use client";

import { usePathname } from "next/navigation";
import { MaintenanceGate } from "@/components/MaintenanceGate";

const publicPaths = new Set(["/privacy", "/personal-data-consent", "/cookies", "/terms", "/cookie-settings", "/warmups/bingo-to-meet-you"]);

export function PublicAccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicBingo = pathname.startsWith("/play/bingo/");
  return publicPaths.has(pathname) || isPublicBingo ? children : <MaintenanceGate />;
}

