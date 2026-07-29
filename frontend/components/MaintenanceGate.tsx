"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LegalFooter } from "@/components/legal/LegalFooter";

export function MaintenanceGate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/maintenance-login", { method: "POST", body: new FormData(event.currentTarget) });
    setLoading(false);
    if (!response.ok) { setError("Неверный логин или пароль"); return; }
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#321b12]">
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center" style={{ background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,.13), transparent 32%), radial-gradient(circle at 80% 75%, rgba(255,180,90,.18), transparent 35%), linear-gradient(135deg, #321b12 0%, #6f321f 48%, #b64f25 100%)" }}>
      <button type="button" onClick={() => setOpen(true)} className="relative z-10 max-w-4xl cursor-pointer border-0 bg-transparent" aria-label="Войти">
        <div className="mb-8 text-7xl sm:text-8xl" aria-hidden="true">🦖</div>
        <h1 className="text-4xl font-black text-white sm:text-6xl lg:text-7xl">Громари съел сайт</h1>
        <p className="mt-6 text-xl font-medium text-orange-100 sm:text-3xl">Заходите позже</p>
      </button>
      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 px-5" onClick={() => setOpen(false)}>
          <form onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-3xl bg-white p-7 text-left shadow-2xl">
            <h2 className="text-2xl font-black text-stone-900">Вход</h2>
            <input name="username" required autoFocus placeholder="Логин" className="mt-6 w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500" />
            <input name="password" required type="password" placeholder="Пароль" className="mt-3 w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-orange-500" />
            {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
            <button disabled={loading} className="mt-5 w-full rounded-xl bg-orange-600 px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? "Входим…" : "Войти"}</button>
          </form>
        </div>
      )}
    </main>
    <LegalFooter dark />
    </div>
  );
}


