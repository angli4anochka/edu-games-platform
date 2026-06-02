'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function CreateFindMatchPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswers, setNewAnswers] = useState('');
  const [newCorrect, setNewCorrect] = useState('');

  const addQuestion = () => {
    if (!newQuestion || !newAnswers || !newCorrect) {
      alert('Заполните все поля!');
      return;
    }

    const answers = newAnswers.split(',').map(a => a.trim());
    const correct = newCorrect.split(',').map(c => parseInt(c.trim()) - 1);

    setQuestions([...questions, {
      question: newQuestion,
      answers,
      correctAnswers: correct
    }]);

    setNewQuestion('');
    setNewAnswers('');
    setNewCorrect('');
  };

  const handleSubmit = () => {
    if (questions.length < 1) {
      alert('Добавьте хотя бы один вопрос!');
      return;
    }

    localStorage.setItem('find_match_data', JSON.stringify(questions));
    router.push('/create/find-match/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">🎯 Найди соответствие</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {questions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Вопросы ({questions.length})</h3>
              {questions.map((q, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2">
                  {q.question}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 p-6 bg-teal-50 rounded-xl">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Вопрос"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newAnswers}
              onChange={(e) => setNewAnswers(e.target.value)}
              placeholder="Варианты через запятую"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={newCorrect}
              onChange={(e) => setNewCorrect(e.target.value)}
              placeholder="Номера правильных (1,3,5)"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <button onClick={addQuestion} className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg">
              Добавить вопрос
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={questions.length < 1}
            className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-lg disabled:opacity-50"
          >
            Начать игру
          </button>
        </div>
      </div>
    </Layout>
  );
}