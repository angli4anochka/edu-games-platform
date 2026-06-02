'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

interface Task {
  topic: string;
  sentence: string;
  answer: string;
  options: string[];
  feedback: string;
}

export default function CreateBubbleGrammarPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([
    {
      topic: 'Present Simple',
      sentence: 'He ______ to school every day.',
      answer: 'goes',
      options: ['go', 'goes', 'going', 'is going'],
      feedback: 'Correct! He/She/It requires -s/-es ending in Present Simple.'
    }
  ]);

  const [currentTask, setCurrentTask] = useState<Task>({
    topic: '',
    sentence: '',
    answer: '',
    options: ['', '', '', ''],
    feedback: ''
  });

  const addTask = () => {
    if (!currentTask.topic || !currentTask.sentence || !currentTask.answer) {
      alert('Заполните тему, предложение и правильный ответ!');
      return;
    }

    const validOptions = currentTask.options.filter(opt => opt.trim() !== '');
    if (!validOptions.includes(currentTask.answer)) {
      alert('Правильный ответ должен быть среди вариантов!');
      return;
    }

    if (validOptions.length < 2) {
      alert('Добавьте хотя бы 2 варианта ответа!');
      return;
    }

    setTasks([...tasks, { ...currentTask, options: validOptions }]);
    setCurrentTask({
      topic: '',
      sentence: '',
      answer: '',
      options: ['', '', '', ''],
      feedback: ''
    });
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (tasks.length === 0) {
      alert('Добавьте хотя бы одно задание!');
      return;
    }

    localStorage.setItem('bubble_grammar_activity', JSON.stringify({ tasks }));
    router.push('/create/bubble-grammar/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/create')}
            className="hover:text-gray-900"
          >
            Выберите шаблон
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-900">Ввести контент</span>
          <span>›</span>
          <span className="text-gray-400">Играть</span>
        </div>

        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-2xl">
            🫧
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bubble Grammar Pop</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Как играть
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Игроки видят предложение с пропуском</li>
              <li>• Варианты ответов появляются в виде пузырьков</li>
              <li>• Нужно нажать на правильный пузырёк</li>
              <li>• Правильный ответ лопается, неправильный трясется</li>
              <li>• За правильные ответы начисляются очки</li>
            </ul>
          </div>

          {/* Список заданий */}
          {tasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Добавленные задания ({tasks.length})</h3>
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {task.topic}
                        </span>
                        <p className="mt-2 font-medium">{task.sentence}</p>
                        <p className="text-sm text-green-600 mt-1">
                          Ответ: {task.answer}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Варианты: {task.options.join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeTask(index)}
                        className="text-red-600 hover:text-red-800 text-xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Форма добавления задания */}
          <div className="space-y-4 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-lg font-semibold">Новое задание</h3>

            {/* Тема */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Грамматическая тема
              </label>
              <input
                type="text"
                value={currentTask.topic}
                onChange={(e) => setCurrentTask({...currentTask, topic: e.target.value})}
                placeholder="Например: Present Simple"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Предложение */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Предложение (используйте ______ для пропуска)
              </label>
              <input
                type="text"
                value={currentTask.sentence}
                onChange={(e) => setCurrentTask({...currentTask, sentence: e.target.value})}
                placeholder="He ______ to school every day."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Правильный ответ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Правильный ответ
              </label>
              <input
                type="text"
                value={currentTask.answer}
                onChange={(e) => setCurrentTask({...currentTask, answer: e.target.value})}
                placeholder="goes"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Варианты ответов */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Варианты ответов (включая правильный)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {currentTask.options.map((option, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentTask.options];
                      newOptions[idx] = e.target.value;
                      setCurrentTask({...currentTask, options: newOptions});
                    }}
                    placeholder={`Вариант ${idx + 1}`}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>

            {/* Обратная связь */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пояснение (необязательно)
              </label>
              <input
                type="text"
                value={currentTask.feedback}
                onChange={(e) => setCurrentTask({...currentTask, feedback: e.target.value})}
                placeholder="Объяснение правильного ответа"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={addTask}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Добавить задание
            </button>
          </div>

          {/* Кнопка запуска */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <div className="text-sm text-gray-600">
              {tasks.length === 0
                ? 'Добавьте хотя бы одно задание'
                : `Добавлено заданий: ${tasks.length}`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={tasks.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Начать игру 🫧
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}