'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateTypeAnswerPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newHint, setNewHint] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const addQuestion = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert('Введите вопрос и ответ!');
      return;
    }

    setQuestions([...questions, {
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      hint: newHint.trim() || undefined,
      caseSensitive
    }]);

    setNewQuestion('');
    setNewAnswer('');
    setNewHint('');
    setCaseSensitive(false);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (questions.length < 1) {
      alert('Добавьте хотя бы один вопрос!');
      return;
    }

    localStorage.setItem('type_answer_data', JSON.stringify(questions));
    router.push('/create/type-answer/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">⌨️ Введи ответ</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {questions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Вопросы ({questions.length})</h3>
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{q.question}</p>
                      <p className="text-sm text-gray-600">Ответ: {q.answer}</p>
                      {q.hint && <p className="text-sm text-gray-500">Подсказка: {q.hint}</p>}
                      {q.caseSensitive && <span className="text-xs bg-yellow-100 px-2 py-1 rounded">Учитывать регистр</span>}
                    </div>
                    <button
                      onClick={() => removeQuestion(i)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 p-6 bg-indigo-50 rounded-xl">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Вопрос"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Правильный ответ"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              placeholder="Подсказка (необязательно)"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Учитывать регистр букв</span>
            </label>
            <button
              onClick={addQuestion}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Добавить вопрос
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={questions.length < 1}
            className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700"
          >
            Начать игру
          </button>
        </div>
      </div>
    </Layout>
  );
}