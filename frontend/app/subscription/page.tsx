'use client';

import { Layout } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Бесплатный',
    price: '0',
    period: '',
    description: 'Попробуйте платформу',
    features: [
      '5 шаблонов активностей',
      'Базовые игры',
      'Просмотр результатов',
      'Таблица лидеров',
    ],
    limitations: [
      'Без AI генератора',
      'Без продвинутой аналитики',
    ],
    buttonText: 'Текущий план',
    highlighted: false,
    current: true,
  },
  {
    name: 'Премиум',
    price: '499',
    period: '/месяц',
    description: 'Для активных учителей',
    features: [
      'Безлимитное создание активностей',
      'Все типы игр и шаблонов',
      'AI генератор контента',
      'Продвинутая аналитика',
      'Экспорт результатов',
      'Приоритетная поддержка',
    ],
    limitations: [],
    buttonText: 'Оформить подписку',
    highlighted: true,
    current: false,
  },
  {
    name: 'Школа',
    price: '2999',
    period: '/месяц',
    description: 'Для образовательных учреждений',
    features: [
      'Все из плана Премиум',
      'До 50 учителей',
      'Управление классами',
      'Корпоративная аналитика',
      'Брендирование платформы',
      'Персональный менеджер',
      'Обучение команды',
    ],
    limitations: [],
    buttonText: 'Связаться с нами',
    highlighted: false,
    current: false,
  },
];

export default function SubscriptionPage() {
  const router = useRouter();

  const handleSubscribe = (planName: string) => {
    if (planName === 'Бесплатный') {
      return;
    }
    if (planName === 'Школа') {
      alert('Свяжитесь с нами по email: school@uniplay-kids.ru');
      return;
    }
    alert('Платежная система в разработке. Скоро будет доступна!');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Выберите подходящий план
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Начните с бесплатного плана и откройте полный потенциал платформы с Премиум подпиской
          </p>
        </div>

        {/* Free Limit Banner */}
        <div className="mb-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
              ℹ️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Ограничение бесплатного плана
              </h3>
              <p className="text-gray-700">
                Вы можете создать <strong>5 бесплатных активностей</strong>. После этого потребуется подписка для создания новых шаблонов.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl scale-105 border-4 border-blue-400'
                  : 'bg-white border-2 border-gray-200 shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Рекомендуем
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Текущий
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span
                    className={`text-5xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`ml-2 text-xl ${
                      plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                    }`}
                  >
                    {plan.period ? `₽${plan.period}` : '₽'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={plan.current}
                className={`w-full py-3 px-6 rounded-xl font-semibold mb-6 transition-all ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                    : plan.current
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.buttonText}
              </button>

              <div className="space-y-3 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-sm ${
                        plan.highlighted
                          ? 'bg-blue-400 text-white'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-blue-50' : 'text-gray-700'
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-300">
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm">
                        ✕
                      </span>
                      <span className="text-sm text-gray-600">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Часто задаваемые вопросы
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Что происходит после 5 бесплатных активностей?
              </h3>
              <p className="text-gray-600">
                После создания 5 активностей вам потребуется оформить подписку Премиум для продолжения создания новых шаблонов. Все ранее созданные активности останутся доступны.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Могу ли я отменить подписку в любое время?
              </h3>
              <p className="text-gray-600">
                Да, вы можете отменить подписку в любой момент. После отмены доступ к премиум функциям сохранится до конца оплаченного периода.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Что включает план "Школа"?
              </h3>
              <p className="text-gray-600">
                План для школ включает все функции Премиум, плюс возможность добавить до 50 учителей, корпоративную аналитику, брендирование и персонального менеджера.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Есть ли скидки для некоммерческих организаций?
              </h3>
              <p className="text-gray-600">
                Да, мы предоставляем специальные условия для некоммерческих образовательных организаций. Свяжитесь с нами для получения подробностей.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Готовы улучшить свои уроки?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам учителей, которые уже используют Uniplay-Kids для создания увлекательных образовательных активностей
          </p>
          <button
            onClick={() => router.push('/create')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl"
          >
            Начать создавать
          </button>
        </div>
      </div>
    </Layout>
  );
}
