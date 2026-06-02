'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/components/games/Quiz';

export default function CreateQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [title, setTitle] = useState('Моя викторина');
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswers, setNewAnswers] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newImage, setNewImage] = useState('');

  const emojiSuggestions = ['🌍', '🚀', '🎨', '🎭', '🎪', '🏆', '⚽', '🏀', '🎯', '🎲', '📚', '💡'];

  const addQuestion = () => {
    if (!newQuestion.trim()) {
      alert('Введите вопрос!');
      return;
    }

    const filledAnswers = newAnswers.filter(a => a.trim());
    if (filledAnswers.length < 2) {
      alert('Введите минимум 2 варианта ответа!');
      return;
    }

    if (correctAnswerIndex >= filledAnswers.length) {
      alert('Выберите правильный ответ из заполненных вариантов!');
      return;
    }

    setQuestions([...questions, {
      question: newQuestion.trim(),
      answers: filledAnswers,
      correctAnswer: correctAnswerIndex,
      explanation: newExplanation.trim() || undefined,
      image: newImage || undefined
    }]);

    // Reset form
    setNewQuestion('');
    setNewAnswers(['', '', '', '']);
    setCorrectAnswerIndex(0);
    setNewExplanation('');
    setNewImage('');
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (questions.length === 0) {
      alert('Добавьте хотя бы один вопрос!');
      return;
    }

    localStorage.setItem('quiz_config', JSON.stringify({
      questions,
      title,
      timePerQuestion
    }));
    router.push('/create/quiz/play');
  };

  const addExampleQuestions = () => {
    setQuestions([
      {
        question: "Какая столица России?",
        answers: ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург"],
        correctAnswer: 0,
        explanation: "Москва является столицей Российской Федерации с 1918 года.",
        image: "🏛️"
      },
      {
        question: "Сколько планет в Солнечной системе?",
        answers: ["7", "8", "9", "10"],
        correctAnswer: 1,
        explanation: "В Солнечной системе 8 планет после того, как Плутон был переклассифицирован в карликовую планету.",
        image: "🪐"
      },
      {
        question: "Какой океан самый большой?",
        answers: ["Атлантический", "Индийский", "Северный Ледовитый", "Тихий"],
        correctAnswer: 3,
        explanation: "Тихий океан - самый большой океан на Земле, занимающий треть поверхности планеты.",
        image: "🌊"
      }
    ]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Breadcrumbs */}
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

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl">
            ❓
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Викторина</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Settings */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название викторины
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время на вопрос (сек)
              </label>
              <select
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={15}>15 секунд</option>
                <option value={30}>30 секунд</option>
                <option value={45}>45 секунд</option>
                <option value={60}>60 секунд</option>
                <option value={0}>Без ограничения</option>
              </select>
            </div>
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Добавленные вопросы ({questions.length})
              </h3>
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {q.image && <span className="text-2xl">{q.image}</span>}
                          <p className="font-medium">Вопрос {index + 1}: {q.question}</p>
                        </div>
                        <div className="space-y-1 text-sm">
                          {q.answers.map((answer, i) => (
                            <div key={i} className={`flex items-center gap-2 ${i === q.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                              <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                {String.fromCharCode(65 + i)}
                              </span>
                              {answer}
                              {i === q.correctAnswer && ' ✓'}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="text-sm text-blue-600 mt-2">💡 {q.explanation}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-800 text-xl font-bold ml-4"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Question Form */}
          <div className="space-y-4 p-6 bg-indigo-50 rounded-xl">
            <h3 className="text-lg font-semibold">Добавить вопрос</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Вопрос
                </label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Например: Какая столица Франции?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Эмодзи (необязательно)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="🌍"
                    maxLength={2}
                    className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-1">
                    {emojiSuggestions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewImage(emoji)}
                        className="w-8 h-8 hover:bg-gray-200 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Варианты ответов
              </label>
              <div className="space-y-2">
                {newAnswers.map((answer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswerIndex === index}
                      onChange={() => setCorrectAnswerIndex(index)}
                      disabled={!answer.trim()}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => {
                        const newArr = [...newAnswers];
                        newArr[index] = e.target.value;
                        setNewAnswers(newArr);
                      }}
                      placeholder={`Вариант ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Отметьте правильный ответ радиокнопкой слева
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пояснение (необязательно)
              </label>
              <input
                type="text"
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
                placeholder="Объяснение правильного ответа"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={addQuestion}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Добавить вопрос
              </button>
              <button
                onClick={addExampleQuestions}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Добавить примеры
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <div className="text-sm text-gray-600">
              {questions.length === 0
                ? 'Добавьте хотя бы один вопрос'
                : `Добавлено вопросов: ${questions.length}`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={questions.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Начать викторину ❓
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}