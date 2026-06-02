'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';

export default function Home() {
  const categories = [
    { name: 'Анаграммы', visual: 'GAMES', count: '1 248 шаблонов', gradient: 'linear-gradient(135deg, #ff8c42, #d94c21)', textColor: '#fff', link: '/create/anagram' },
    { name: 'Словесные игры', visual: 'WORDS', count: '2 103 шаблона', gradient: 'linear-gradient(135deg, #ffd89b, #ffb347)', textColor: '#7a4b2f', link: '/create/word-snake' },
    { name: 'Викторины', visual: '☑ ≡', count: '3 642 шаблона', gradient: 'linear-gradient(135deg, #e5e5e5, #9e9e9e)', textColor: '#fff', link: '/create' },
    { name: 'Сопоставления', visual: '▭↔▭', count: '2 215 шаблонов', gradient: 'linear-gradient(135deg, #f7a35c, #e65a27)', textColor: '#fff', link: '/create' },
    { name: 'Флешкарточки', visual: 'A 🍎', count: '2 987 шаблонов', gradient: 'linear-gradient(135deg, #ff7961, #d94c21)', textColor: '#fff', link: '/create' },
    { name: 'Колесо фортуны', visual: '◉', count: '1 105 шаблонов', gradient: 'linear-gradient(135deg, #d4a5f9, #9b59b6)', textColor: '#5a2d7a', link: '/create' },
    { name: 'Конструктор предложений', visual: 'I like', count: '1 536 шаблонов', gradient: 'linear-gradient(135deg, #ffe066, #ffb347)', textColor: '#7a4b2f', link: '/create' },
    { name: 'Классные доски', visual: '▣ ✦', count: '1 873 шаблона', gradient: 'linear-gradient(135deg, #f7c29b, #d97735)', textColor: '#fff', link: '/create' },
  ];

  const activities = [
    { title: 'Столицы мира — викторина (география)', author: 'Мария Иванова', views: '12.3K', rating: '4.9', badge: 'Викторина', avatar: 'М' },
    { title: 'Найди слова: школа и учёба', author: 'Екатерина Волкова', views: '8.7K', rating: '4.8', badge: 'Словесная игра', avatar: 'Е' },
    { title: 'Доли и дроби — соотнеси картинки', author: 'Дмитрий Смирнов', views: '9.4K', rating: '4.9', badge: 'Сопоставление', avatar: 'Д' },
    { title: 'Побег из библиотеки — математический квест', author: 'Алексей Кузнецов', views: '6.2K', rating: '4.7', badge: 'Квест-комната', avatar: 'А' },
    { title: 'Мозговой штурм: идеи для проекта', author: 'Ольга Соколова', views: '5.1K', rating: '4.8', badge: 'Классная доска', avatar: 'О' },
    { title: 'Еда и напитки — словарь (английский язык)', author: 'Игорь Иванов', views: '7.8K', rating: '4.8', badge: 'Флешкарточки', avatar: 'И' },
    { title: 'Правописание: безударные гласные', author: 'Светлана Петрова', views: '6.5K', rating: '4.7', badge: 'Викторина', avatar: 'С' },
    { title: 'Таблица умножения — тренажёр', author: 'Николай Сидоров', views: '11.2K', rating: '4.9', badge: 'Игра', avatar: 'Н' },
  ];

  return (
    <DashboardLayout>
      <div className="py-9 px-9">
        {/* Hero Banner - Large and Spacious */}
        <section
          className="min-h-[340px] rounded-[28px] overflow-hidden relative p-12 mb-9"
          style={{
            background: 'linear-gradient(90deg, rgba(255, 235, 208, 0.98) 0%, rgba(255, 240, 220, 0.85) 40%, rgba(255, 248, 238, 0.35) 68%), radial-gradient(circle at 88% 50%, rgba(255, 173, 86, 0.26), transparent 25%)',
            border: '1px solid rgba(219, 134, 82, 0.18)',
            boxShadow: '0 10px 32px rgba(103, 61, 29, 0.09)'
          }}
        >
          {/* Background Image - Right Side Only */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[42%] opacity-90 hidden lg:block"
            style={{
              background: 'radial-gradient(circle at 82% 48%, rgba(87, 117, 56, 0.12), transparent 16%), linear-gradient(90deg, rgba(255, 244, 227, 0.95) 0%, rgba(255, 244, 227, 0.22) 35%, transparent 50%), url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop") center/cover',
              maskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-[720px]">
            <h1
              className="text-[42px] leading-[1.15] font-bold mb-4"
              style={{ color: '#492719', fontFamily: 'Georgia, serif', letterSpacing: '-0.035em' }}
            >
              Шаблоны активностей от сообщества учителей
            </h1>
            <p className="text-lg mb-8 font-semibold leading-relaxed" style={{ color: '#6b4d39' }}>
              Ищите, находите и используйте готовые интерактивные задания в пару кликов.
            </p>

            {/* Wide Search Bar */}
            <div
              className="grid grid-cols-[1fr_auto] gap-3 bg-white rounded-[18px] p-2.5 max-w-[640px]"
              style={{ border: '1px solid rgba(207, 134, 88, 0.26)', boxShadow: '0 12px 30px rgba(103, 61, 29, 0.09)' }}
            >
              <input
                type="search"
                placeholder="Например, 'Present Simple' или 'дроби'"
                className="border-0 outline-none px-5 py-1 text-base font-semibold"
                style={{ color: '#3d2518' }}
              />
              <button
                className="px-7 py-3.5 rounded-[14px] font-black text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #e65a27, #c83b18)', boxShadow: '0 12px 26px rgba(202, 59, 24, 0.26)' }}
              >
                Найти
              </button>
            </div>

            {/* Popular Tags */}
            <div className="flex items-center gap-3 flex-wrap mt-6">
              <span className="text-sm font-bold" style={{ color: '#5a3e2b' }}>Популярно:</span>
              {['Present Simple', 'Доли и дроби', 'Времена глаголов', 'Словарный запас'].map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2.5 rounded-full text-xs font-black transition-all hover:scale-105 cursor-pointer"
                  style={{ color: '#7a4b2f', background: 'rgba(255, 252, 247, 0.82)', border: '1px solid rgba(204, 123, 74, 0.28)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Categories - Large Cards in Single Row */}
        <section className="mb-10">
          <div className="grid grid-cols-8 gap-5">
            {categories.map((cat, idx) => (
              <Link key={idx} href={cat.link}>
                <article
                  className="min-h-[165px] rounded-[22px] p-5 relative overflow-hidden transition-all cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl"
                  style={{
                    background: cat.gradient,
                    color: cat.textColor,
                    boxShadow: '0 14px 28px rgba(103, 61, 29, 0.12)'
                  }}
                >
                  <h3 className="text-[15px] font-black mb-6 leading-tight" style={{ minHeight: '40px' }}>
                    {cat.name}
                  </h3>
                  <div
                    className="text-[28px] font-black mb-4"
                    style={{ filter: 'drop-shadow(0 10px 12px rgba(60,30,16,0.24))' }}
                  >
                    {cat.visual}
                  </div>
                  <div className="text-[11px] font-black opacity-90">{cat.count}</div>
                  <div
                    className="absolute -right-7 -bottom-7 w-24 h-24 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.16)' }}
                  />
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Templates */}
        <section>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2
              className="text-[32px] font-bold"
              style={{ color: '#2f1e16', letterSpacing: '-0.03em' }}
            >
              Популярные шаблоны сообщества
            </h2>
            <button
              className="px-6 py-3.5 rounded-[14px] font-black text-sm transition-all hover:-translate-y-0.5"
              style={{ color: '#d94c21', border: '1px solid rgba(217, 76, 33, 0.24)', background: 'rgba(255, 247, 237, 0.88)' }}
            >
              Показать больше шаблонов ⌄
            </button>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {activities.map((activity, idx) => (
              <article
                key={idx}
                className="rounded-[20px] overflow-hidden transition-all cursor-pointer hover:-translate-y-1.5"
                style={{
                  background: 'rgba(255, 252, 246, 0.92)',
                  border: '1px solid rgba(214, 147, 92, 0.24)',
                  boxShadow: '0 12px 28px rgba(103, 61, 29, 0.08)'
                }}
              >
                {/* Preview Block - More square proportions */}
                <div
                  className="aspect-[4/3] relative overflow-hidden"
                  style={{ background: '#fff3e3' }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(circle at 14% 14%, rgba(255, 255, 255, 0.58), transparent 22%), linear-gradient(135deg, rgba(222, 94, 45, 0.24), rgba(255, 227, 192, 0.82))' }}
                  />
                  <span
                    className="absolute top-3 left-3 z-10 px-2.5 py-1.5 rounded-lg text-white text-[11px] font-black"
                    style={{ background: 'linear-gradient(135deg, #e85c2b, #bd3e1d)', boxShadow: '0 10px 18px rgba(169, 58, 31, 0.26)' }}
                  >
                    {activity.badge}
                  </span>
                  <div className="absolute inset-0 z-[1] flex items-center justify-center p-6">
                    <div
                      className="w-full h-full rounded-[18px] border"
                      style={{ background: 'rgba(255,255,255,0.75)', borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}
                    />
                  </div>
                </div>

                {/* Card Info - More compact */}
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 leading-snug line-clamp-2" style={{ color: '#2e201a', minHeight: '36px' }}>
                    {activity.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold" style={{ color: '#7b5c49' }}>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                      style={{ background: 'linear-gradient(135deg, #f7c29b, #b95531)' }}
                    >
                      {activity.avatar}
                    </span>
                    <span className="text-xs truncate">{activity.author}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-black" style={{ color: '#7d5d49' }}>
                    <span>◉ {activity.views}</span>
                    <span style={{ color: '#f7a725' }}>★ {activity.rating}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center mt-9">
            <button
              className="px-7 py-3.5 rounded-[14px] font-black text-sm transition-all hover:-translate-y-0.5"
              style={{ color: '#d94c21', border: '1px solid rgba(217, 76, 33, 0.24)', background: 'rgba(255, 247, 237, 0.88)' }}
            >
              Показать больше шаблонов ›
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
