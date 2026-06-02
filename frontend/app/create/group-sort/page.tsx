'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  content: string;
  groupId: string;
  image?: string;
}

interface Group {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

const colorOptions = [
  { name: 'Зеленый', value: '#10b981' },
  { name: 'Синий', value: '#3b82f6' },
  { name: 'Оранжевый', value: '#f59e0b' },
  { name: 'Красный', value: '#ef4444' },
  { name: 'Фиолетовый', value: '#8b5cf6' },
  { name: 'Розовый', value: '#ec4899' },
];

const iconOptions = ['📚', '🎨', '🏃', '🌍', '🔬', '🎭', '🎪', '🏆', '⚽', '🍎', '🐾', '🚗'];

export default function CreateGroupSortPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'Группа 1', color: '#10b981', icon: '📚' },
    { id: '2', name: 'Группа 2', color: '#3b82f6', icon: '🎨' },
  ]);

  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('Сортировка по группам');

  // Form for new group
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#10b981');
  const [newGroupIcon, setNewGroupIcon] = useState('📂');

  // Form for new item
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemGroup, setNewItemGroup] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  const addGroup = () => {
    if (!newGroupName.trim()) {
      alert('Введите название группы!');
      return;
    }

    if (groups.length >= 6) {
      alert('Максимум 6 групп!');
      return;
    }

    setGroups([...groups, {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      color: newGroupColor,
      icon: newGroupIcon
    }]);

    setNewGroupName('');
  };

  const removeGroup = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
    setItems(items.filter(i => i.groupId !== id));
  };

  const addItem = () => {
    if (!newItemContent.trim()) {
      alert('Введите название элемента!');
      return;
    }

    if (!newItemGroup) {
      alert('Выберите группу для элемента!');
      return;
    }

    setItems([...items, {
      id: Date.now().toString(),
      content: newItemContent.trim(),
      groupId: newItemGroup,
      image: newItemImage || undefined
    }]);

    setNewItemContent('');
    setNewItemImage('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSubmit = () => {
    if (groups.length < 2) {
      alert('Создайте минимум 2 группы!');
      return;
    }

    if (items.length < 4) {
      alert('Добавьте минимум 4 элемента!');
      return;
    }

    // Check if each group has at least one item
    const groupsWithItems = new Set(items.map(i => i.groupId));
    if (groupsWithItems.size < groups.length) {
      alert('В каждой группе должен быть хотя бы один элемент!');
      return;
    }

    localStorage.setItem('group_sort_config', JSON.stringify({
      title,
      groups,
      items
    }));
    router.push('/create/group-sort/play');
  };

  const addExampleData = () => {
    setGroups([
      { id: 'fruits', name: 'Фрукты', color: '#10b981', icon: '🍎' },
      { id: 'animals', name: 'Животные', color: '#3b82f6', icon: '🐾' },
      { id: 'transport', name: 'Транспорт', color: '#f59e0b', icon: '🚗' },
    ]);

    setItems([
      { id: '1', content: 'Яблоко', groupId: 'fruits', image: '🍎' },
      { id: '2', content: 'Банан', groupId: 'fruits', image: '🍌' },
      { id: '3', content: 'Апельсин', groupId: 'fruits', image: '🍊' },
      { id: '4', content: 'Собака', groupId: 'animals', image: '🐕' },
      { id: '5', content: 'Кошка', groupId: 'animals', image: '🐱' },
      { id: '6', content: 'Слон', groupId: 'animals', image: '🐘' },
      { id: '7', content: 'Машина', groupId: 'transport', image: '🚗' },
      { id: '8', content: 'Самолет', groupId: 'transport', image: '✈️' },
      { id: '9', content: 'Велосипед', groupId: 'transport', image: '🚲' },
    ]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => router.push('/create')} className="hover:text-gray-900">
            Выберите шаблон
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-900">Ввести контент</span>
          <span>›</span>
          <span className="text-gray-400">Играть</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
            📂
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Сортировка по группам</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название активности
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Groups */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Группы ({groups.length})</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="p-3 rounded-lg border-2"
                  style={{ borderColor: group.color, backgroundColor: `${group.color}10` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{group.icon}</span>
                      <span className="font-medium">{group.name}</span>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                    </div>
                    <button
                      onClick={() => removeGroup(group.id)}
                      className="text-red-600 hover:text-red-800 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Элементов: {items.filter(i => i.groupId === group.id).length}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Group Form */}
            <div className="p-4 bg-purple-50 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Название группы"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <select
                  value={newGroupColor}
                  onChange={(e) => setNewGroupColor(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {colorOptions.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-1">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewGroupIcon(icon)}
                      className={`w-8 h-8 rounded hover:bg-gray-200 ${newGroupIcon === icon ? 'bg-gray-300' : ''}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addGroup}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Добавить группу
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Элементы ({items.length})</h3>

            {items.length > 0 && (
              <div className="space-y-2 mb-4">
                {items.map((item) => {
                  const group = groups.find(g => g.id === item.groupId);
                  return (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.image && <span className="text-xl">{item.image}</span>}
                        <span className="font-medium">{item.content}</span>
                        <span
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: group?.color }}
                        >
                          {group?.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Item Form */}
            <div className="p-4 bg-orange-50 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  placeholder="Название элемента"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <select
                  value={newItemGroup}
                  onChange={(e) => setNewItemGroup(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Выберите группу</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  placeholder="Эмодзи"
                  maxLength={2}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={addItem}
                disabled={groups.length === 0}
                className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Добавить элемент
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={addExampleData}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Загрузить пример
            </button>

            <button
              onClick={handleSubmit}
              disabled={groups.length < 2 || items.length < 4}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Начать сортировку 📂
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}