import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BingoActivity } from "@/lib/bingo";

const dataDirectory = process.env.BINGO_DATA_DIR ?? path.join(process.cwd(), ".data", "bingo");

export async function saveBingo(activity: BingoActivity) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(path.join(dataDirectory, `${activity.id}.json`), JSON.stringify(activity, null, 2), { encoding: "utf8", flag: "wx" });
}

export async function getBingo(id: string): Promise<BingoActivity | null> {
  if (!/^[A-Z0-9]{6}$/.test(id)) return null;
  try {
    return JSON.parse(await readFile(path.join(dataDirectory, `${id}.json`), "utf8")) as BingoActivity;
  } catch {
    return null;
  }
}
