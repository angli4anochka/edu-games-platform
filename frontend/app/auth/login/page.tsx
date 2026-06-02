'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Login user
    const result = login({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      // Redirect to home page after successful login
      router.push('/');
    } else {
      setError(result.error || 'Ошибка входа');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-144px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Вход
            </h1>
            <p className="text-gray-600">
              Войдите в свой аккаунт для продолжения
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="ivan@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Введите пароль"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  Забыли пароль?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Нет аккаунта?{' '}
                  <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Демо-доступ
                </h3>
                <p className="text-xs text-gray-700 mb-2">
                  Для быстрого тестирования вы можете зарегистрировать новый аккаунт или использовать существующий.
                </p>
                <p className="text-xs text-gray-600">
                  Все данные хранятся локально в браузере
                </p>
              </div>
            </div>
          </div>

          {/* Social Login (Optional) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">
                  Или войти с помощью
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Google
              </button>
              <button
                type="button"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                VK
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
