import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { BingoActivity, BingoGridSize, BingoItem } from "@/lib/bingo";
import { hasCenterCell, requiredItemCount } from "@/lib/bingo";
import { saveBingo } from "@/lib/bingo-store";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
async function canCreate() {
  const secret = process.env.MAINTENANCE_SECRET ?? "";
  const token = (await cookies()).get("maintenance_access")?.value ?? "";
  const expected = secret ? createHmac("sha256", secret).update("maintenance-access").digest("hex") : "";
  return Boolean(secret && safeEqual(token, expected));
}
function cleanItems(value: unknown): BingoItem[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).map((raw, index) => {
    const item = raw as Partial<BingoItem>;
    const label = String(item.label ?? "").trim().slice(0, 100);
    const prompt = String(item.prompt ?? "").trim().slice(0, 180);
    return { id: `item_${index + 1}`, label, prompt: prompt || label };
  }).filter((item) => item.label);
}

export async function POST(request: Request) {
  if (!(await canCreate())) return NextResponse.json({ error: "Конструктор доступен пользователям Premium" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || ![3, 4, 5].includes(body.gridSize)) return NextResponse.json({ error: "Некорректный размер поля" }, { status: 400 });
  const gridSize = body.gridSize as BingoGridSize;
  const freeCell = Boolean(body.freeCell && hasCenterCell(gridSize));
  const items = cleanItems(body.items);
  const minimum = requiredItemCount(gridSize, freeCell);
  if (items.length < minimum) return NextResponse.json({ error: `Добавьте минимум ${minimum} заданий` }, { status: 400 });
  const activity: BingoActivity = {
    id: randomBytes(4).toString("hex").slice(0, 6).toUpperCase(),
    title: String(body.title || "Моё Bingo").trim().slice(0, 100),
    instructions: String(body.instructions || "").trim().slice(0, 500),
    gridSize, freeCell, winCondition: body.winCondition === "full" ? "full" : "line",
    allowNewCard: Boolean(body.allowNewCard), items, createdAt: new Date().toISOString(),
  };
  try { await saveBingo(activity); } catch { activity.id = randomBytes(4).toString("hex").slice(0, 6).toUpperCase(); await saveBingo(activity); }
  return NextResponse.json({ id: activity.id, playUrl: `/play/bingo/${activity.id}` });
}
