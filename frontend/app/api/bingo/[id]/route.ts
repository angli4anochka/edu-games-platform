import { NextResponse } from "next/server";
import { getBingo } from "@/lib/bingo-store";

export async function GET(_request: Request, { params }: RouteContext<"/api/bingo/[id]">) {
  const { id } = await params;
  const activity = await getBingo(id.toUpperCase());
  return activity ? NextResponse.json(activity) : NextResponse.json({ error: "Игра не найдена" }, { status: 404 });
}
