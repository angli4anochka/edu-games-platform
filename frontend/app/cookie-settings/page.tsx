"use client";
import { useEffect, useState } from "react";
import { LegalPage } from "@/components/legal/LegalPage";

export default function CookieSettingsPage() {
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(localStorage.getItem("cookie_preferences") === "necessary"); }, []);
  function save() { localStorage.setItem("cookie_preferences", "necessary"); setSaved(true); }
  function clear() { localStorage.removeItem("cookie_preferences"); setSaved(false); }
  return <LegalPage title="Настройки cookies">
    <p>В текущей версии используются только технически необходимые данные. Аналитические и маркетинговые инструменты не подключены.</p>
    <div className="my-6 rounded-2xl border border-slate-200 p-5"><div className="flex items-center justify-between gap-4"><div><h2 className="!m-0 !text-lg">Необходимые cookies</h2><p className="!mb-0 mt-1 text-sm text-slate-600">Авторизация и безопасная работа сайта. Всегда включены.</p></div><input type="checkbox" checked disabled aria-label="Необходимые cookies включены" className="h-5 w-5" /></div></div>
    <div className="my-6 rounded-2xl border border-slate-200 p-5 opacity-70"><div className="flex items-center justify-between gap-4"><div><h2 className="!m-0 !text-lg">Аналитические cookies</h2><p className="!mb-0 mt-1 text-sm text-slate-600">Не используются.</p></div><input type="checkbox" disabled aria-label="Аналитические cookies выключены" className="h-5 w-5" /></div></div>
    <div className="flex flex-wrap gap-3"><button onClick={save} className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">Сохранить выбор</button><button onClick={clear} className="rounded-xl border border-slate-300 px-5 py-3 font-bold">Сбросить настройки</button></div>
    {saved && <p className="mt-4 font-semibold text-green-700">Настройки сохранены.</p>}
  </LegalPage>;
}
