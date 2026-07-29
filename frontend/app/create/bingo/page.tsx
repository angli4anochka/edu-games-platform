"use client";

import { useMemo, useState } from "react";
import type { BingoGridSize } from "@/lib/bingo";
import { hasCenterCell, requiredItemCount } from "@/lib/bingo";

const starter = [
  "likes pizza | Do you like pizza?", "has got a dog | Have you got a dog?", "can swim | Can you swim?",
  "likes football | Do you like football?", "has got a brother | Have you got a brother?", "can ride a bike | Can you ride a bike?",
  "likes drawing | Do you like drawing?", "has got a cat | Have you got a cat?", "can sing | Can you sing?",
  "likes ice cream | Do you like ice cream?", "walks to school | Do you walk to school?", "can cook | Can you cook?",
  "likes English | Do you like English?", "has got blue eyes | Have you got blue eyes?", "can dance | Can you dance?",
  "likes cartoons | Do you like cartoons?", "reads before bed | Do you read before bed?", "can whistle | Can you whistle?",
  "likes animals | Do you like animals?", "has got a bike | Have you got a bike?", "can draw well | Can you draw well?",
  "likes summer | Do you like summer?", "is happy today | Are you happy today?", "can run fast | Can you run fast?",
].join("\n");

export default function BingoBuilderPage() {
  const [title, setTitle] = useState("Getting to Know You");
  const [size, setSize] = useState<BingoGridSize>(5);
  const [freeCell, setFreeCell] = useState(true);
  const [winCondition, setWinCondition] = useState<"line" | "full">("line");
  const [allowNewCard, setAllowNewCard] = useState(false);
  const [source, setSource] = useState(starter);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<{ id: string; playUrl: string } | null>(null);
  const effectiveFree = freeCell && hasCenterCell(size);
  const minimum = requiredItemCount(size, effectiveFree);
  const items = useMemo(() => source.split("\n").map((line, index) => {
    const [label, ...prompt] = line.split("|");
    return { id: `draft_${index}`, label: label.trim(), prompt: prompt.join("|").trim() || label.trim() };
  }).filter((item) => item.label), [source]);

  async function save() {
    setError(""); setCreated(null);
    if (items.length < minimum) { setError(`Нужно минимум ${minimum} заполненных строк. Сейчас: ${items.length}.`); return; }
    setSaving(true);
    const response = await fetch("/api/bingo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, gridSize: size, freeCell: effectiveFree, winCondition, allowNewCard, items }) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) { setError(result.error || "Не удалось сохранить игру"); return; }
    setCreated(result);
  }

  const preview = items.slice(0, minimum);
  if (effectiveFree) preview.splice(Math.floor(size * size / 2), 0, { id: "free", label: "FREE SPACE", prompt: "" });

  return <main className="min-h-screen bg-[#fff8ec] px-4 py-8 text-[#17324d]">
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div><a href="/warmups" className="font-bold text-blue-700">← Warm-ups</a><h1 className="mt-2 text-4xl font-black">Конструктор Bingo</h1><p className="mt-2 text-slate-600">Создайте задания, проверьте карточку и отправьте ссылку ученикам.</p></div>
        <span className="rounded-full bg-amber-200 px-4 py-2 font-black">★ Premium</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <label className="block font-bold">Название игры<input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 outline-none focus:border-blue-500" /></label>
          <fieldset className="mt-6"><legend className="font-bold">Размер поля</legend><div className="mt-2 flex gap-2">{([3,4,5] as BingoGridSize[]).map(value => <button type="button" onClick={() => { setSize(value); if (value === 4) setFreeCell(false); }} className={`rounded-xl px-5 py-3 font-black ${size === value ? "bg-blue-600 text-white" : "bg-slate-100"}`} key={value}>{value}×{value}</button>)}</div></fieldset>
          <label className="mt-5 flex items-center gap-3 font-semibold"><input type="checkbox" checked={effectiveFree} disabled={!hasCenterCell(size)} onChange={e => setFreeCell(e.target.checked)} className="h-5 w-5" />Свободная клетка в центре</label>
          <label className="mt-5 block font-bold">Победа<select value={winCondition} onChange={e => setWinCondition(e.target.value as "line" | "full")} className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3"><option value="line">Одна линия</option><option value="full">Вся карточка</option></select></label>
          <label className="mt-5 flex items-center gap-3 font-semibold"><input type="checkbox" checked={allowNewCard} onChange={e => setAllowNewCard(e.target.checked)} className="h-5 w-5" />Разрешить новую карточку</label>
          <div className="mt-6 flex items-end justify-between"><label className="font-bold">Задания</label><span className={items.length >= minimum ? "font-bold text-emerald-700" : "font-bold text-amber-700"}>{items.length} / минимум {minimum}</span></div>
          <p className="mt-1 text-sm text-slate-500">Одна строка: текст на карточке | вопрос ребёнку</p>
          <textarea value={source} onChange={e => setSource(e.target.value)} rows={13} className="mt-3 w-full resize-y rounded-xl border-2 border-slate-200 p-3 font-mono text-sm outline-none focus:border-blue-500" />
          {error && <p className="mt-3 rounded-xl bg-red-50 p-3 font-semibold text-red-700">{error}</p>}
          <button type="button" disabled={saving} onClick={save} className="mt-4 w-full rounded-xl bg-[#17324d] px-5 py-4 font-black text-white disabled:opacity-50">{saving ? "Сохраняем…" : "Сохранить и получить ссылку"}</button>
          {created && <div className="mt-4 rounded-2xl bg-emerald-50 p-4"><p className="font-black text-emerald-800">Игра создана · код {created.id}</p><a href={created.playUrl} className="mt-2 block break-all font-bold text-blue-700" target="_blank">{location.origin}{created.playUrl}</a><button type="button" onClick={() => navigator.clipboard.writeText(location.origin + created.playUrl)} className="mt-3 rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white">Скопировать ссылку</button></div>}
        </section>
        <section className="rounded-3xl bg-white/80 p-5 shadow-xl"><div className="mb-4"><span className="text-sm font-black uppercase tracking-wider text-blue-600">Предпросмотр</span><h2 className="text-3xl font-black">{title || "Моё Bingo"}</h2></div><div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>{preview.map((item, index) => <div key={`${item.id}_${index}`} className={`flex aspect-square items-center justify-center rounded-xl border-2 p-2 text-center font-bold ${item.id === "free" ? "border-amber-400 bg-amber-100" : "border-slate-200 bg-white"}`}>{item.label}</div>)}</div>{items.length > minimum && <p className="mt-4 text-sm text-slate-500">Остальные {items.length - minimum} заданий будут участвовать в перемешивании карточек.</p>}</section>
      </div>
    </div>
  </main>;
}
