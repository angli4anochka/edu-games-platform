import Link from "next/link";

const links = [
  ["Политика обработки персональных данных", "/privacy"],
  ["Согласие на обработку персональных данных", "/personal-data-consent"],
  ["Политика cookies", "/cookies"],
  ["Пользовательское соглашение", "/terms"],
  ["Настройки cookies", "/cookie-settings"],
] as const;

export function LegalFooter({ dark = false }: { dark?: boolean }) {
  return (
    <footer className={`px-5 py-8 text-center text-sm ${dark ? "text-orange-100" : "text-slate-600"}`}>
      <nav className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-3 gap-y-2" aria-label="Юридическая информация">
        {links.map(([label, href], index) => (
          <span key={href} className="contents">
            <Link className={`underline-offset-4 hover:underline ${dark ? "hover:text-white" : "hover:text-blue-700"}`} href={href}>{label}</Link>
            {index < links.length - 1 && <span aria-hidden="true">·</span>}
          </span>
        ))}
      </nav>
      <p className="mt-5">© 2026 UniPlay Kids. Все права защищены. База данных размещена на серверах в Российской Федерации.</p>
      <p className="mt-2">Оператор ПДн: Малахова Альбина Сергеевна (самозанятая, ИНН 312824955688), г. Москва · <a className="underline underline-offset-4" href="mailto:angli4anochka@gmail.com">angli4anochka@gmail.com</a></p>
    </footer>
  );
}
