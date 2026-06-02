'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

// Все шаблоны (статичные данные)
const allTemplates = [
  // Standard templates
  { id: 'anagram', name: 'Анаграмма', description: 'Перетаскивайте буквы в правильные позиции, чтобы составить слово или фразу.', icon: '/images/anagram-icon.webp', iconType: 'image', type: 'standard', category: 'words' },
  { id: 'spin-wheel', name: 'Колесо фортуны', description: 'Крутите колесо, чтобы увидеть, какой элемент выпадет следующим.', icon: '🎡', type: 'standard', category: 'random' },
  { id: 'open-box', name: 'Открыть коробку', description: 'Нажимайте на каждую коробку по очереди, чтобы открыть и увидеть, что внутри.', icon: '📦', type: 'standard', category: 'random' },
  { id: 'unjumble', name: 'Составь предложение', description: 'Перетащите слова, чтобы расставить их в правильном порядке в предложении.', icon: '🔀', type: 'standard', category: 'words' },
  { id: 'matching-pairs', name: 'Найди пары', description: 'Нажимайте на пару плиток одновременно, чтобы узнать, совпадают ли они.', icon: '🎴', type: 'standard', category: 'matching' },
  { id: 'quiz', name: 'Викторина', description: 'Серия вопросов с множественным выбором. Нажмите правильный ответ, чтобы продолжить.', icon: '❓', type: 'standard', category: 'quiz' },
  { id: 'group-sort', name: 'Сортировка по группам', description: 'Перетащите каждый элемент в соответствующую группу.', icon: '📂', type: 'standard', category: 'matching' },
  { id: 'match-up', name: 'Сопоставление', description: 'Перетащите каждое ключевое слово к его определению.', icon: '🔗', type: 'standard', category: 'matching' },
  { id: 'flash-cards', name: 'Карточки', description: 'Проверьте себя с помощью карточек с вопросами на лицевой стороне и ответами на обратной.', icon: '📇', type: 'standard', category: 'quiz' },
  { id: 'speaking-cards', name: 'Разговорные карточки', description: 'Раздавайте карты случайным образом из перемешанной колоды.', icon: '🗣️', type: 'standard', category: 'random' },
  { id: 'complete-sentence', name: 'Дополни предложение', description: 'Перетащите слова в пустые места в тексте.', icon: '📝', type: 'standard', category: 'words' },
  { id: 'find-match', name: 'Найди соответствие', description: 'Нажимайте на подходящий ответ, чтобы удалить его. Повторяйте, пока все не исчезнут.', icon: '🎯', type: 'standard', category: 'matching' },

  // Custom games
  { id: 'word-snake', name: 'Змейка слов', description: 'Управляйте змейкой, чтобы собрать буквы слова в правильном порядке.', icon: '🐍', type: 'standard', category: 'words' },
  { id: 'bubble-grammar', name: 'Bubble Grammar Pop', description: 'Лопайте пузырьки с правильными грамматическими формами.', icon: '🫧', type: 'standard', category: 'quiz' },
  { id: 'racing-letters', name: 'Гонки букв', description: 'Управляйте машинкой и собирайте правильные буквы, избегая неправильных.', icon: '🏎️', type: 'standard', category: 'visual' },

  // Pro templates
  { id: 'type-answer', name: 'Введи ответ', description: 'Введите правильный ответ для каждого вопроса или подсказки.', icon: '⌨️', type: 'pro', category: 'quiz' },
  { id: 'flip-tiles', name: 'Переворот плиток', description: 'Исследуйте серию двусторонних плиток, нажимая для увеличения и проводя для переворота.', icon: '🔄', type: 'pro', category: 'visual' },
  { id: 'labelled-diagram', name: 'Подписанная диаграмма', description: 'Перетащите булавки в правильное место на изображении.', icon: '📍', type: 'pro', category: 'visual' },
  { id: 'hangman', name: 'Виселица', description: 'Попробуйте завершить слово, выбирая правильные буквы.', icon: '🎯', type: 'pro', category: 'words' },
  { id: 'wordsearch', name: 'Поиск слов', description: 'Слова спрятаны в сетке букв. Найдите их как можно быстрее.', icon: '🔍', type: 'pro', category: 'words' },
  { id: 'spell-word', name: 'Напиши слово', description: 'Прослушайте слово и напишите его правильно.', icon: '🔤', type: 'pro', category: 'words' }
];

const categories = [
  { id: 'all', name: 'Все шаблоны', icon: '🎮' },
  { id: 'quiz', name: 'Викторины и тесты', icon: '📝' },
  { id: 'matching', name: 'Сопоставление', icon: '🔗' },
  { id: 'words', name: 'Игры со словами', icon: '📖' },
  { id: 'visual', name: 'Визуальные', icon: '🎨' },
  { id: 'random', name: 'Случайность', icon: '🎲' },
];

export default function CreateActivityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация
  const filteredTemplates = allTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const standardTemplates = filteredTemplates.filter(t => t.type === 'standard');
  const proTemplates = filteredTemplates.filter(t => t.type === 'pro');

  return (
    <Layout>
      {/* Gradient background for glassmorphism effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen relative">
        {/* Header */}
        <div className="mb-8 backdrop-blur-lg bg-white/20 rounded-2xl p-6 border border-white/30 shadow-xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <span>Выберите шаблон</span>
            <span className="text-3xl">✨</span>
          </h1>
          <p className="text-gray-700 font-medium">
            Выберите из {allTemplates.length} готовых шаблонов активностей
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Поиск шаблонов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3.5 text-base backdrop-blur-lg bg-white/40 border border-white/30 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all
              placeholder-gray-600 shadow-lg"
          />
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 backdrop-blur-md ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500/80 to-blue-600/80 text-white shadow-lg transform scale-105'
                  : 'bg-white/40 text-gray-700 hover:bg-white/60 border border-white/30 hover:shadow-md'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Templates */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Шаблоны не найдены</p>
          </div>
        ) : (
          <>
            {/* Standard */}
            {standardTemplates.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-8">Стандартные шаблоны</h2>
                <ul className="card-grid">
                  {standardTemplates.map((template, index) => (
                    <li key={template.id} style={{ zIndex: standardTemplates.length - index }}>
                      <TemplateCard template={template} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pro */}
            {proTemplates.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900">PRO шаблоны</h2>
                  <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    PRO
                  </span>
                </div>
                <ul className="card-grid">
                  {proTemplates.map((template, index) => (
                    <li key={template.id} style={{ zIndex: proTemplates.length - index }}>
                      <TemplateCard template={template} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

// Карточка шаблона (стиль Wordwall)
function TemplateCard({ template }: { template: any }) {
  const router = useRouter();
  const isPro = template.type === 'pro';

  const handleClick = () => {
    console.log('Template clicked:', template.id, template.name);

    // Переход на страницу создания активности
    if (template.id === 'anagram') {
      router.push('/create/anagram');
    } else if (template.id === 'spin-wheel') {
      router.push('/create/spin-wheel');
    } else if (template.id === 'open-box') {
      console.log('Opening open-box...');
      router.push('/create/open-box');
    } else if (template.id === 'racing-letters') {
      router.push('/create/racing-letters');
    } else if (template.id === 'unjumble') {
      router.push('/create/unjumble');
    } else if (template.id === 'matching-pairs') {
      router.push('/create/matching-pairs');
    } else if (template.id === 'quiz') {
      router.push('/create/quiz');
    } else if (template.id === 'word-snake') {
      router.push('/create/word-snake');
    } else if (template.id === 'group-sort') {
      router.push('/create/group-sort');
    } else if (template.id === 'flash-cards') {
      router.push('/create/flash-cards');
    } else if (template.id === 'match-up') {
      router.push('/create/match-up');
    } else if (template.id === 'speaking-cards') {
      router.push('/create/speaking-cards');
    } else if (template.id === 'complete-sentence') {
      router.push('/create/complete-sentence');
    } else if (template.id === 'find-match') {
      router.push('/create/find-match');
    } else if (template.id === 'bubble-grammar') {
      router.push('/create/bubble-grammar');
    } else if (template.id === 'type-answer') {
      router.push('/create/type-answer');
    } else if (template.id === 'flip-tiles') {
      router.push('/create/flip-tiles');
    } else if (template.id === 'labelled-diagram') {
      router.push('/create/labelled-diagram');
    } else if (template.id === 'hangman') {
      router.push('/create/hangman');
    } else if (template.id === 'wordsearch') {
      router.push('/create/wordsearch');
    } else if (template.id === 'spell-word') {
      router.push('/create/spell-word');
    } else {
      console.log('Template not implemented:', template.id);
      alert(`Скоро будет доступно: ${template.name}`);
    }
  };

  // Точные цвета из референса Wordwall - пастельные и мягкие
  const categoryStyles: { [key: string]: { bg: string; iconBg: string; decorColor: string } } = {
    'words': {
      bg: 'from-blue-50 via-blue-50/80 to-blue-100/60',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-500',
      decorColor: 'text-blue-300'
    },
    'quiz': {
      bg: 'from-pink-50 via-pink-50/80 to-pink-100/60',
      iconBg: 'bg-gradient-to-br from-pink-400 to-pink-500',
      decorColor: 'text-pink-300'
    },
    'matching': {
      bg: 'from-purple-50 via-purple-50/80 to-purple-100/60',
      iconBg: 'bg-gradient-to-br from-purple-400 to-purple-500',
      decorColor: 'text-purple-300'
    },
    'visual': {
      bg: 'from-orange-50 via-orange-50/80 to-orange-100/60',
      iconBg: 'bg-gradient-to-br from-orange-400 to-orange-500',
      decorColor: 'text-orange-300'
    },
    'random': {
      bg: 'from-amber-50 via-amber-50/80 to-yellow-50/60',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-400',
      decorColor: 'text-amber-300'
    },
  };

  const style = categoryStyles[template.category] || categoryStyles['words'];

  return (
    <div className="card-wrapper group" onClick={handleClick}>
      <div className="card-panel relative">
        {/* Main card - компактная горизонтальная карточка как в референсе, вся карточка кликабельна */}
        <div className={`card-content relative bg-gradient-to-br ${style.bg} rounded-2xl
          border border-gray-100 transition-all duration-300 overflow-hidden h-[180px]
          group-hover:border-gray-200 group-hover:brightness-105`}>

          {/* Декоративные элементы - точно как в референсе */}
          {/* Круги справа вверху */}
          <div className={`absolute top-3 right-3 w-7 h-7 rounded-full ${style.decorColor} opacity-30 transition-all duration-300 group-hover:opacity-50 group-hover:scale-110`}>
            <div className="w-full h-full rounded-full bg-current"></div>
          </div>
          <div className={`absolute top-8 right-10 w-5 h-5 rounded-full ${style.decorColor} opacity-20 transition-all duration-300 group-hover:opacity-40 group-hover:scale-110`}>
            <div className="w-full h-full rounded-full bg-current"></div>
          </div>

          {/* Декоративные символы */}
          <div className={`absolute bottom-4 right-4 ${style.decorColor} opacity-15 text-4xl font-bold transition-all duration-300 group-hover:opacity-30 group-hover:scale-110`}>
            ✦
          </div>
          <div className={`absolute top-1/2 right-6 ${style.decorColor} opacity-10 text-2xl transition-all duration-300 group-hover:opacity-25 group-hover:scale-110`}>
            ●
          </div>

          {/* Content - горизонтальный layout */}
          <div className="relative z-10 p-4 flex gap-3 h-full">
            {/* PRO badge */}
            {isPro && (
              <div className="absolute top-2 right-2 z-20">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded transition-transform duration-300 group-hover:scale-110">
                  PRO
                </span>
              </div>
            )}

            {/* Icon block слева - крупная иконка */}
            <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
              <div className={`w-[72px] h-[72px] rounded-2xl ${style.iconBg} flex items-center justify-center shadow-md`}>
                {template.iconType === 'image' ? (
                  <img
                    src={template.icon}
                    alt={template.name}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-4xl filter drop-shadow-sm">{template.icon}</span>
                )}
              </div>
            </div>

            {/* Text content справа - компактный блок */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              {/* Title */}
              <h3 className="text-sm font-bold text-gray-900 mb-1.5 transition-colors duration-300 group-hover:text-gray-700 leading-tight">
                {template.name}
              </h3>

              {/* Description - 2 строки */}
              <p className="text-[11px] text-gray-600 leading-snug transition-colors duration-300 group-hover:text-gray-700 line-clamp-2">
                {template.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
