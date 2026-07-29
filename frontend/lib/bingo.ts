export type BingoGridSize = 3 | 4 | 5;

export interface BingoItem {
  id: string;
  label: string;
  prompt: string;
}

export interface BingoActivity {
  id: string;
  title: string;
  instructions: string;
  gridSize: BingoGridSize;
  freeCell: boolean;
  winCondition: "line" | "full";
  allowNewCard: boolean;
  items: BingoItem[];
  createdAt: string;
}

export function requiredItemCount(size: BingoGridSize, freeCell: boolean) {
  return size * size - (freeCell ? 1 : 0);
}

export function hasCenterCell(size: BingoGridSize) {
  return size % 2 === 1;
}
