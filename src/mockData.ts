import { VoiceMessage } from './types';

// Generate simulated waveform data points (0-100)
export function generateWaveform(length = 40): number[] {
  return Array.from({ length }, (_, i) => {
    const base = 25 + Math.sin(i * 0.4) * 20;
    const variation = Math.sin(i * 1.5) * 25 + Math.random() * 30;
    return Math.min(100, Math.max(15, Math.round(base + variation)));
  });
}

export const INITIAL_VOICE_MESSAGES: VoiceMessage[] = [
  {
    id: 'msg-001',
    telegramMessageId: 1042,
    telegramChatId: 98765432,
    sender: {
      name: 'Елена Смирнова',
      username: 'elena_pm',
      avatarColor: 'bg-emerald-500',
    },
    forwardedFrom: {
      name: 'Клиентский чат "FinTech Alpha"',
      username: 'fintech_alpha_team',
    },
    receivedAt: '2026-09-21T13:45:00.000Z',
    durationSeconds: 224, // 3 мин 44 сек
    status: 'completed',
    transcription: {
      fullText:
        'Привет! Слушай, только что закончился созвон с клиентом по проекту FinTech Alpha. В целом всё супер, релиз они одобряют, но есть три критических момента. Первое: нужно до пятницы 18:00 поправить баг с валидацией СБП платежей в чекауте, там падает ошибка 422 у пользователей с длинными именами. Второе: маркетинг хочет запустить промокампанию в понедельник, поэтому до четверга нам нужны финальные баннеры и промолендинг. Я уже попросила Артёма подключить аналитику Amplitude к новым экранам онбординга. И третье: по бюджету на второй квартал мы укладываемся, но нужно согласовать доплату за серверные мощности около 45 000 рублей из-за возросшей нагрузки. Пожалуйста, проверь бэклог в Jira и подтверди, что мы успеваем к дедлайну в пятницу. Спасибо, жду обратной связи!',
      wordCount: 128,
      language: 'ru',
    },
    summary: {
      headline: 'Успешный созвон по FinTech Alpha: 3 срочные задачи перед пятничным релизом',
      overview:
        'Клиент согласовал релиз, но обозначил жесткие сроки: исправление критического бага СБП до пятницы, подготовка промолендинга к четвергу и донастройка аналитики Amplitude. Бюджет соблюден, требуется аппрув доплаты 45 000 ₽ за серверы.',
      category: 'Срочно',
      urgency: 88,
      urgencyLevel: 'high',
      sentiment: 'Конструктивный',
      sentimentScore: 78,
      timeSavedPercent: 85,
      readingTimeSeconds: 34,
    },
    infographics: {
      topics: [
        { name: 'Исправление бага СБП', percentage: 40, color: '#EF4444', description: 'Ошибка 422 в чекауте при валидации' },
        { name: 'Маркетинг и Промокампания', percentage: 30, color: '#3B82F6', description: 'Баннеры, промолендинг, онбординг' },
        { name: 'Серверный бюджет', percentage: 18, color: '#10B981', description: 'Доплата 45 000 ₽ за мощности' },
        { name: 'Синхронизация бэклога', percentage: 12, color: '#8B5CF6', description: 'Проверка Jira и подтверждение дедлайна' },
      ],
      keyTakeaways: [
        { text: 'Клиент в целом доволен и готов к релизу при условии закрытия блокеров', importance: 'high' },
        { text: 'Критический дедлайн по багфиксу платежей — пятница 18:00', importance: 'high' },
        { text: 'Промолендинг и баннеры для маркетинга должны быть готовы к четвергу', importance: 'medium' },
        { text: 'Бюджет в норме, согласовать доплату 45 тыс. руб на инфраструктуру', importance: 'normal' },
      ],
      actionItems: [
        {
          id: 'act-1',
          title: 'Пофиксить ошибку 422 при валидации СБП в чекауте',
          assignee: 'Backend-разработчик',
          priority: 'urgent',
          deadline: 'Пятница, 18:00',
          completed: false,
        },
        {
          id: 'act-2',
          title: 'Подготовить промолендинг и графику для маркетинга',
          assignee: 'Дизайн / Frontend',
          priority: 'urgent',
          deadline: 'Четверг, 19:00',
          completed: false,
        },
        {
          id: 'act-3',
          title: 'Подключить события Amplitude к экранам онбординга',
          assignee: 'Артём (Аналитик)',
          priority: 'medium',
          deadline: 'Пятница',
          completed: true,
        },
        {
          id: 'act-4',
          title: 'Согласовать доплату 45 000 ₽ за серверные мощности',
          assignee: 'PM / Фин. отдел',
          priority: 'medium',
          deadline: 'Среда',
          completed: false,
        },
      ],
      timeline: [
        { timestamp: '00:12', seconds: 12, label: 'Итоги созвона', detail: 'Клиент одобрил общий релиз FinTech Alpha' },
        { timestamp: '00:48', seconds: 48, label: 'Баг СБП (блокер)', detail: 'Ошибка 422 в валидации платежей, дедлайн пятница' },
        { timestamp: '01:35', seconds: 95, label: 'Маркетинг и аналитика', detail: 'Промокампания в понедельник, интеграция Amplitude' },
        { timestamp: '02:40', seconds: 160, label: 'Финансы и сервера', detail: 'Доплата 45 000 руб за возросшую нагрузку' },
        { timestamp: '03:20', seconds: 200, label: 'Запрос действия', detail: 'Сверить Jira-бэклог и подтвердить готовность' },
      ],
      entities: [
        { category: 'Проекты', name: 'FinTech Alpha' },
        { category: 'Люди', name: 'Артём' },
        { category: 'Дедлайны', name: 'Пятница 18:00' },
        { category: 'Дедлайны', name: 'Четверг' },
        { category: 'Финансы', name: '45 000 ₽' },
        { category: 'Инструменты', name: 'Amplitude' },
        { category: 'Инструменты', name: 'Jira' },
        { category: 'Инструменты', name: 'СБП' },
      ],
    },
    waveform: generateWaveform(48),
  },
  {
    id: 'msg-002',
    telegramMessageId: 1043,
    telegramChatId: 98765432,
    sender: {
      name: 'Максим Романов',
      username: 'max_sales',
      avatarColor: 'bg-indigo-500',
    },
    receivedAt: '2026-09-21T11:20:00.000Z',
    durationSeconds: 156, // 2 мин 36 сек
    status: 'completed',
    transcription: {
      fullText:
        'Коллеги, доброе утро! Переговорил с генеральным директором "Сфера Недвижимости". Они готовы подписать годовой контракт на сопровождение. Из ключевых договоренностей: базовая стоимость 180 000 рублей в месяц с НДС. Они просят включить SLA со временем реакции до 15 минут в рабочие часы и выделенный чат в Telegram. Юристы с их стороны пришлют протокол разногласий сегодня до 16:00. Нам нужно оперативно проверить пункт 4.2 по штрафам за простой и подготовить коммерческое приложение со списком специалистов. Давайте назначим короткий синк на 15 минут сразу после обеда.',
      wordCount: 86,
      language: 'ru',
    },
    summary: {
      headline: 'Согласован годовой контракт с "Сфера Недвижимости" на 180 000 ₽/мес',
      overview:
        'Клиент готов к подписанию годового договора с ежемесячной оплатой 180 000 ₽. Требуется включить SLA 15 минут, проверить протокол разногласий по штрафам и сформировать приложение со списком специалистов.',
      category: 'Финансы',
      urgency: 65,
      urgencyLevel: 'medium',
      sentiment: 'Позитивный',
      sentimentScore: 92,
      timeSavedPercent: 82,
      readingTimeSeconds: 28,
    },
    infographics: {
      topics: [
        { name: 'Финансовые условия (180k/мес)', percentage: 45, color: '#10B981', description: 'Годовой контракт на сопровождение с НДС' },
        { name: 'Требования к SLA (15 мин)', percentage: 30, color: '#F59E0B', description: 'Время реакции и выделенный чат в Telegram' },
        { name: 'Юридические правки', percentage: 25, color: '#6366F1', description: 'Проверка пункта 4.2 по штрафным санкциям' },
      ],
      keyTakeaways: [
        { text: 'Крупная сделка: годовой контракт на 2.16 млн рублей в год', importance: 'high' },
        { text: 'Ожидается протокол разногласий от юристов клиента до 16:00', importance: 'high' },
        { text: 'Требуется подтвердить возможность соблюдения SLA 15 минут', importance: 'medium' },
      ],
      actionItems: [
        {
          id: 'act-201',
          title: 'Проверить протокол разногласий и пункт 4.2 по штрафам',
          assignee: 'Юрист / Максим',
          priority: 'urgent',
          deadline: 'Сегодня, 17:00',
          completed: false,
        },
        {
          id: 'act-202',
          title: 'Подготовить приложение к договору со списком команды',
          assignee: 'Team Lead',
          priority: 'medium',
          deadline: 'Завтра, 12:00',
          completed: false,
        },
        {
          id: 'act-203',
          title: 'Провести синк по SLA и готовности саппорта',
          assignee: 'Максим + Support Lead',
          priority: 'medium',
          deadline: 'Сегодня, 14:30',
          completed: true,
        },
      ],
      timeline: [
        { timestamp: '00:10', seconds: 10, label: 'Успешные переговоры', detail: 'Согласие на годовой контракт' },
        { timestamp: '00:45', seconds: 45, label: 'Сумма и условия', detail: '180 000 руб/мес, SLA 15 минут в Telegram' },
        { timestamp: '01:25', seconds: 85, label: 'Юридический протокол', detail: 'Ждем правки по пункту 4.2 до 16:00' },
        { timestamp: '02:10', seconds: 130, label: 'Следующий шаг', detail: 'Короткий синк после обеда' },
      ],
      entities: [
        { category: 'Проекты', name: 'Сфера Недвижимости' },
        { category: 'Финансы', name: '180 000 ₽ / мес' },
        { category: 'Метрики', name: 'SLA 15 минут' },
        { category: 'Дедлайны', name: 'Сегодня 16:00' },
        { category: 'Люди', name: 'Генеральный директор' },
      ],
    },
    waveform: generateWaveform(36),
  },
  {
    id: 'msg-003',
    telegramMessageId: 1044,
    telegramChatId: 98765432,
    sender: {
      name: 'Анна Васильева',
      username: 'anna_design',
      avatarColor: 'bg-purple-500',
    },
    receivedAt: '2026-09-20T17:15:00.000Z',
    durationSeconds: 110, // 1 мин 50 сек
    status: 'completed',
    transcription: {
      fullText:
        'Ребята, привет! Закинула в Figma новые макеты мобильного дашборда и интерактивных графиков. Я добавила темную тему по умолчанию для ночного режима, переработала карточки ключевых метрик — теперь они более компактные и без лишнего визуального шума. Еще сделала анимацию прогресс-баров при загрузке данных. Посмотрите, пожалуйста, раздел компонентов в дизайн-системе. Если всё ок, в среду передам верстку фронтендерам. Жду ваших реакций в комментариях к фреймам!',
      wordCount: 65,
      language: 'ru',
    },
    summary: {
      headline: 'Обновление мобильного дашборда в Figma: темная тема и облегченные метрики',
      overview:
        'В Figma опубликованы обновленные макеты мобильного дашборда: добавлена поддержка темной темы, оптимизированы карточки метрик и отрисованы микровзаимодействия. Передача в разработку запланирована на среду.',
      category: 'Идеи',
      urgency: 35,
      urgencyLevel: 'low',
      sentiment: 'Позитивный',
      sentimentScore: 95,
      timeSavedPercent: 78,
      readingTimeSeconds: 22,
    },
    infographics: {
      topics: [
        { name: 'Мобильный дашборд', percentage: 55, color: '#8B5CF6', description: 'Карточки метрик и компактный лейаут' },
        { name: 'Темная тема и стили', percentage: 30, color: '#3B82F6', description: 'Ночной режим и компоненты UI' },
        { name: 'Анимации и передача в dev', percentage: 15, color: '#EC4899', description: 'Микровзаимодействия и передача в среду' },
      ],
      keyTakeaways: [
        { text: 'Новые макеты мобильного дашборда готовы к ревью в Figma', importance: 'medium' },
        { text: 'Добавлена системная темная тема для вечернего режима использования', importance: 'normal' },
        { text: 'Срок передачи фронтендерам — среда после аппрува команды', importance: 'medium' },
      ],
      actionItems: [
        {
          id: 'act-301',
          title: 'Оставить фидбек по макетам в Figma',
          assignee: 'Команда продукта',
          priority: 'medium',
          deadline: 'Вторник, вечер',
          completed: false,
        },
        {
          id: 'act-302',
          title: 'Подготовить ассеты и токены для frontend-разработки',
          assignee: 'Анна',
          priority: 'low',
          deadline: 'Среда',
          completed: false,
        },
      ],
      timeline: [
        { timestamp: '00:08', seconds: 8, label: 'Публикация в Figma', detail: 'Макеты загружены для ревью' },
        { timestamp: '00:35', seconds: 35, label: 'Темная тема', detail: 'Новый стиль для ночного режима' },
        { timestamp: '01:05', seconds: 65, label: 'Анимации прогресса', detail: 'Микроанимации при подгрузке данных' },
        { timestamp: '01:35', seconds: 95, label: 'План на среду', detail: 'Передача утвержденных макетов в разработку' },
      ],
      entities: [
        { category: 'Инструменты', name: 'Figma' },
        { category: 'Проекты', name: 'Мобильный дашборд' },
        { category: 'Дедлайны', name: 'Среда' },
        { category: 'Дедлайны', name: 'Вторник' },
      ],
    },
    waveform: generateWaveform(28),
  },
];
