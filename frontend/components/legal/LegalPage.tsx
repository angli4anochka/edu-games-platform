import Link from "next/link";
import { ReactNode } from "react";
import { LegalFooter } from "./LegalFooter";

export function LegalPage({ title, updated = "30 июля 2026 года", children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-black text-blue-700">UniPlay Kids</Link>
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-700">На главную</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-10">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_li]:mb-2 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mb-4 [&_p]:leading-7 [&_ul]:ml-6 [&_ul]:list-disc">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-slate-500">Редакция от {updated}</p>
          {children}
        </article>
      </main>
      <LegalFooter />
    </div>
  );
}
