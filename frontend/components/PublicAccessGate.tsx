"use client";

import { usePathname } from "next/navigation";
import { MaintenanceGate } from "@/components/MaintenanceGate";

const publicPaths = new Set(["/privacy", "/personal-data-consent", "/cookies", "/terms", "/cookie-settings"]);

export function PublicAccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return publicPaths.has(pathname) ? children : <MaintenanceGate />;
}
