'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout, type User } from '@/lib/auth';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowUserMenu(false);
    router.push('/');
  };

  const sidebarItems = [
    { icon: '⌂', label: 'Главная', href: '/', active: true },
    { icon: '⌕', label: 'Поиск', href: '/search', active: false },
    { icon: '◎', label: 'Сообщество', href: '/community', active: false },
    { icon: '▦', label: 'Подборки', href: '/collections', active: false },
    { icon: '☆', label: 'Избранное', href: '/favorites', active: false },
    { icon: '◴', label: 'Недавние', href: '/recent', active: false },
    { icon: '♧', label: 'Мои классы', href: '/classes', active: false },
  ];

  const topMenuItems = [
    { label: 'Главная', href: '/', active: true },
    { label: 'Шаблоны', href: '/create', active: false },
    { label: 'Сообщество', href: '/community', active: false },
    { label: 'Мои активности', href: '/my-assignments', active: false },
    { label: 'Мои классы', href: '/classes', active: false },
    { label: 'Тарифы', href: '/subscription', active: false },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(180deg, #fff9ef 0%, #fffdf8 100%)' }}>
      {/* Sidebar */}
      <aside
        className="w-[250px] sticky top-0 h-screen flex flex-col p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 250, 241, 0.96), rgba(255, 246, 232, 0.92))',
          borderRight: '1px solid rgba(201, 113, 70, 0.16)'
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-9">
          <div
            className="w-14 h-14 rounded-[18px] relative overflow-hidden flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0cb8ff, #0e56ff 44%, #7b2cff 100%)',
              boxShadow: '0 12px 25px rgba(64, 84, 255, 0.22)'
            }}
          >
            <span className="text-white text-lg font-black tracking-tighter">UP</span>
            <span className="absolute right-2 top-4 text-white text-xs">▶</span>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight" style={{ color: '#17213a' }}>UniPlay</div>
            <div className="text-[11px] font-black tracking-[0.26em]" style={{ color: '#199fe9' }}>GAMES</div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {sidebarItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`h-14 rounded-2xl flex items-center gap-4 px-5 font-black transition-all ${
                item.active
                  ? 'text-orange-600 shadow-lg'
                  : 'text-amber-900 hover:bg-orange-100/70 hover:translate-x-0.5'
              }`}
              style={item.active ? {
                background: 'linear-gradient(135deg, #fff0df, #ffe2c7)',
                boxShadow: '0 10px 22px rgba(170, 82, 30, 0.12)'
              } : {}}
            >
              <span className="text-xl w-6 text-center">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Premium Card */}
        <div
          className="rounded-[22px] p-6 text-center mt-auto"
          style={{
            background: 'radial-gradient(circle at 25% 20%, rgba(255, 196, 120, 0.72), transparent 35%), linear-gradient(180deg, #fff2df, #ffe7ca)',
            border: '1px solid rgba(216, 103, 48, 0.18)',
            boxShadow: '0 10px 28px rgba(103, 61, 29, 0.08)'
          }}
        >
          <div
            className="h-28 mb-3 rounded-[18px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #f7d5ad, #fff6e9)',
              filter: 'drop-shadow(0 8px 12px rgba(95, 56, 29, 0.14))'
            }}
          >
            <img src="/fox.png" alt="Fox mascot" className="h-24 w-auto object-contain" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#d94c21' }}>Премиум доступ</h3>
          <p className="text-sm font-semibold mb-4" style={{ color: '#6f4d39', lineHeight: 1.45 }}>
            Откройте все возможности UniPlay Games для себя и своих учеников.
          </p>
          <Link href="/subscription">
            <button
              className="w-full h-12 rounded-xl font-black text-white transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #e65a27, #c83b18)',
                boxShadow: '0 12px 24px rgba(202, 59, 24, 0.24)'
              }}
            >
              Подробнее
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-20 sticky top-0 z-10 flex items-center justify-between gap-7 px-7 backdrop-blur-xl"
          style={{
            background: 'rgba(255, 250, 242, 0.9)',
            borderBottom: '1px solid rgba(201, 113, 70, 0.16)'
          }}
        >
          {/* Top Menu */}
          <nav className="flex items-center gap-9">
            {topMenuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`h-20 inline-flex items-center relative font-black text-sm transition-colors ${
                  item.active ? 'text-orange-600' : 'text-amber-900 hover:text-orange-500'
                }`}
              >
                {item.label}
                {item.active && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                    style={{ background: '#d94c21' }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <div
              className="w-[300px] h-12 rounded-2xl flex items-center gap-3 px-4"
              style={{
                background: 'rgba(255,255,255,0.62)',
                border: '1px solid rgba(172, 111, 75, 0.23)'
              }}
            >
              <span className="text-amber-700">⌕</span>
              <span className="text-sm font-bold text-amber-700">Поиск среди активностей</span>
            </div>

            {/* Notifications */}
            <button className="text-2xl text-amber-800">♧</button>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black"
                    style={{
                      background: 'linear-gradient(135deg, #ffd1a6, #c7643e)',
                      boxShadow: '0 10px 22px rgba(128, 73, 41, 0.18)'
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-sm font-bold" style={{ color: '#3d2518' }}>{user.name}</div>
                    <div className="text-xs font-bold" style={{ color: '#8a6b57' }}>
                      {user.role === 'teacher' ? 'Учитель' : 'Ученик'}
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Выйти
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <button
                  className="h-12 px-6 rounded-xl font-black text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #e65a27, #c83b18)',
                    boxShadow: '0 12px 24px rgba(202, 59, 24, 0.24)'
                  }}
                >
                  Войти
                </button>
              </Link>
            )}

            {/* Create Button */}
            <Link href="/create">
              <button
                className="h-12 px-6 rounded-xl font-black text-white transition-all hover:-translate-y-0.5 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #e65a27, #c83b18)',
                  boxShadow: '0 12px 24px rgba(202, 59, 24, 0.24)'
                }}
              >
                ＋ Создать активность
              </button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
