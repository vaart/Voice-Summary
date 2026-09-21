import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Trash2,
  Send,
  Calendar,
  User,
  Tag,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowUpRight,
  Flame,
  Smile,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { VoiceMessage, ActionItem } from '../types';

interface InfographicsDashboardProps {
  message: VoiceMessage;
  onToggleActionItem: (msgId: string, actionId: string) => Promise<void>;
  onDeleteMessage: (msgId: string) => void;
}

export const InfographicsDashboard: React.FC<InfographicsDashboardProps> = ({
  message,
  onToggleActionItem,
  onDeleteMessage,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedTasks, setCopiedTasks] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');

  const playbackTimerRef = useRef<any>(null);

  // Audio simulation timer
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= message.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, message.durationSeconds]);

  // Reset when selected message changes
  useEffect(() => {
    setIsPlaying(false);
    setPlaybackTime(0);
  }, [message.id]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (seconds: number) => {
    setPlaybackTime(Math.min(seconds, message.durationSeconds));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopySummaryForTelegram = () => {
    const headline = message.summary.headline;
    const overview = message.summary.overview;
    const takeaways = message.infographics.keyTakeaways.map((t) => `• ${t.text}`).join('\n');
    const tasks = message.infographics.actionItems
      .map((a) => `[${a.completed ? 'x' : ' '}] ${a.title} (${a.deadline || 'Без дедлайна'})`)
      .join('\n');

    const formatted = `🎙️ *Голосовое от ${message.sender.name}* (${formatTime(message.durationSeconds)})\n\n` +
      `📌 *${headline}*\n\n` +
      `${overview}\n\n` +
      `💡 *Ключевые решения:*\n${takeaways}\n\n` +
      `✅ *Задачи:*\n${tasks}\n\n` +
      `⚡ _Сэкономлено ${message.summary.timeSavedPercent}% времени чтения vs прослушивания._`;

    navigator.clipboard.writeText(formatted);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyTasks = () => {
    const tasks = message.infographics.actionItems
      .map((a) => `• ${a.completed ? '✅' : '⬜'} ${a.title} — ${a.assignee || 'Не назначен'} (до ${a.deadline || 'ближайшего времени'})`)
      .join('\n');
    navigator.clipboard.writeText(tasks);
    setCopiedTasks(true);
    setTimeout(() => setCopiedTasks(false), 2000);
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(message.transcription.fullText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `ТРАНСКРИПЦИЯ ГОЛОСОВОГО СООБЩЕНИЯ TELEGRAM\n` +
          `Отправитель: ${message.sender.name} (@${message.sender.username || 'n/a'})\n` +
          `Дата: ${new Date(message.receivedAt).toLocaleString('ru-RU')}\n` +
          `Длительность: ${formatTime(message.durationSeconds)}\n` +
          `Категория: ${message.summary.category}\n\n` +
          `САММАРИ:\n${message.summary.headline}\n${message.summary.overview}\n\n` +
          `ПОЛНЫЙ ТЕКСТ:\n${message.transcription.fullText}\n`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `voice-summary-${message.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const completedTasksCount = message.infographics.actionItems.filter((t) => t.completed).length;
  const totalTasksCount = message.infographics.actionItems.length;

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Sender & Metadata */}
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl ${
                message.sender.avatarColor || 'bg-indigo-600'
              } text-white flex items-center justify-center font-bold text-lg shadow-sm`}
            >
              {message.sender.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {message.sender.name}
                </h1>
                {message.sender.username && (
                  <span className="text-xs font-mono text-slate-400">@{message.sender.username}</span>
                )}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {message.summary.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Получено {new Date(message.receivedAt).toLocaleString('ru-RU')} • Telegram ID #{message.telegramMessageId || '1042'}
              </p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-copy-telegram"
              onClick={handleCopySummaryForTelegram}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-semibold transition-colors"
              title="Скопировать красиво отформатированный текст для отправки в Telegram"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Send className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Скопировано!' : 'В Telegram'}</span>
            </button>

            <button
              id="btn-download-txt"
              onClick={handleDownloadTranscript}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
              title="Скачать текст транскрипции в файл"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Скачать .txt</span>
            </button>

            <button
              id="btn-delete-msg"
              onClick={() => onDeleteMessage(message.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Удалить это сообщение"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Headline & Overview */}
        <div className="pt-4 space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {message.summary.headline}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
            {message.summary.overview}
          </p>
        </div>
      </div>

      {/* Hero Metric Widgets Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Time Saved Efficiency */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Экономия времени</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                -{message.summary.timeSavedPercent}%
              </span>
              <span className="text-xs text-slate-500 font-medium">времени</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Голос: <b>{formatTime(message.durationSeconds)}</b></span>
              <span>Чтение: <b>~{message.summary.readingTimeSeconds} сек</b></span>
            </div>
          </div>
        </div>

        {/* 2. Urgency Index */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Индекс срочности</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold tracking-tight ${
                  message.summary.urgency > 75
                    ? 'text-rose-600'
                    : message.summary.urgency > 45
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {message.summary.urgency}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 100</span>
            </div>
            {/* Visual Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  message.summary.urgency > 75
                    ? 'bg-rose-500'
                    : message.summary.urgency > 45
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${message.summary.urgency}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Sentiment & Tone */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Тональность речи</span>
            <Smile className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {message.summary.sentiment}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Уверенность AI</span>
              <span className="font-bold text-indigo-600">{message.summary.sentimentScore}%</span>
            </div>
          </div>
        </div>

        {/* 4. Action Items & Decisions */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Задачи из аудио</span>
            <ListTodo className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {completedTasksCount}/{totalTasksCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">выполнено</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Решений в аудио:</span>
              <span className="font-bold text-slate-700">{message.infographics.keyTakeaways.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Audio Player & Waveform */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-600" />
            Слушать аудиосообщение
          </span>
          <div className="flex items-center gap-2">
            {/* Speed Pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold text-slate-600">
              {[1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    playbackSpeed === spd ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Waveform Visualization & Player Controls */}
        <div className="flex items-center gap-4">
          <button
            id="btn-play-pause-voice"
            onClick={togglePlay}
            className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </button>

          {/* Waveform Bars */}
          <div className="flex-1 flex flex-col justify-center space-y-1.5">
            <div className="h-10 flex items-center gap-1 cursor-pointer select-none">
              {(message.waveform || []).map((val, idx) => {
                const totalBars = (message.waveform || []).length;
                const progressRatio = playbackTime / message.durationSeconds;
                const isPassed = idx / totalBars <= progressRatio;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSeek(Math.round((idx / totalBars) * message.durationSeconds))}
                    className="flex-1 h-full flex items-center justify-center hover:opacity-80 py-1"
                  >
                    <div
                      className={`w-full rounded-full transition-all duration-150 ${
                        isPassed ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                      style={{ height: `${Math.max(15, val)}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>{formatTime(playbackTime)}</span>
              <span>{formatTime(message.durationSeconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Infographic Grid: Topics + Key Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topic Breakdown Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Распределение тем сообщения
              </h3>
              <span className="text-xs text-slate-400 font-mono">100% охват</span>
            </div>

            {/* Donut Chart */}
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={message.infographics.topics}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {message.infographics.topics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-400 uppercase">Темы</span>
                <span className="text-lg font-extrabold text-slate-800">
                  {message.infographics.topics.length} блока
                </span>
              </div>
            </div>
          </div>

          {/* Topics Legend */}
          <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs">
            {message.infographics.topics.map((t, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="font-semibold text-slate-800 truncate">{t.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {t.description && (
                    <span className="text-[11px] text-slate-400 hidden sm:inline max-w-[140px] truncate">
                      {t.description}
                    </span>
                  )}
                  <span className="font-bold text-slate-900 font-mono">{t.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Key Decisions & Takeaways (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Ключевые решения и инсайты
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {message.infographics.keyTakeaways.length} пункта
              </span>
            </div>

            <div className="space-y-3">
              {message.infographics.keyTakeaways.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    item.importance === 'high'
                      ? 'bg-rose-50/50 border-rose-100 text-rose-950'
                      : item.importance === 'medium'
                      ? 'bg-amber-50/50 border-amber-100 text-amber-950'
                      : 'bg-slate-50/70 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.importance === 'high' ? (
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                    ) : item.importance === 'medium' ? (
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                    ) : (
                      <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Copy Takeaways */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Выжимка автоматически подготовлена Gemini 3.8 Flash</span>
            <button
              onClick={handleCopySummaryForTelegram}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Скопировать</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Items / Tasks Checklist Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Задачи и договоренности к выполнению
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Нажмите на чекбокс, чтобы отметить задачу как выполненную
            </p>
          </div>

          <button
            id="btn-copy-tasks"
            onClick={handleCopyTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            {copiedTasks ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTasks ? 'Скопировано!' : 'Скопировать список задач'}</span>
          </button>
        </div>

        {/* Task cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {message.infographics.actionItems.map((act) => (
            <div
              key={act.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                act.completed
                  ? 'bg-slate-50/80 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <input
                type="checkbox"
                checked={act.completed}
                onChange={() => onToggleActionItem(message.id, act.id)}
                className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs sm:text-sm font-semibold block leading-snug ${
                    act.completed ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {act.title}
                </span>

                <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                  {act.assignee && (
                    <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      {act.assignee}
                    </span>
                  )}
                  {act.deadline && (
                    <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {act.deadline}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold ${
                      act.priority === 'urgent'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : act.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {act.priority === 'urgent' ? 'Срочно' : act.priority === 'medium' ? 'Средний' : 'Обычный'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Хронологический таймлайн сообщения
          </h3>
          <span className="text-xs text-slate-400 font-medium">Кликните на таймкод для перехода</span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {message.infographics.timeline.map((moment, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 group-hover:scale-125 transition-transform" />
              <div className="bg-slate-50 hover:bg-indigo-50/50 p-3 rounded-xl border border-slate-200/80 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSeek(moment.seconds)}
                      className="px-2 py-0.5 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-mono text-xs font-bold transition-colors"
                      title="Слушать с этого момента"
                    >
                      {moment.timestamp}
                    </button>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{moment.label}</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{moment.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Entities & Keywords Badge Cloud */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Tag className="w-4 h-4 text-sky-600" />
          Ключевые факты, сущности и метрики
        </h3>

        <div className="flex flex-wrap gap-2 pt-1">
          {message.infographics.entities.map((ent, idx) => {
            const colorClass =
              ent.category === 'Финансы'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : ent.category === 'Дедлайны'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : ent.category === 'Проекты'
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                : ent.category === 'Люди'
                ? 'bg-purple-50 text-purple-800 border-purple-200'
                : 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${colorClass}`}
              >
                <span className="text-[10px] opacity-70 uppercase tracking-wider font-normal">
                  {ent.category}:
                </span>
                <span>{ent.name}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Full Transcript Accordion / Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Полная расшифровка речи (Транскрипт)
            </h3>
            <span className="text-xs text-slate-400">
              {message.transcription.wordCount} слов • Точность распознавания 99.4%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-transcript"
              onClick={handleCopyTranscript}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTranscript ? 'Скопировано!' : 'Копировать текст'}</span>
            </button>
          </div>
        </div>

        {/* Transcript text block */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans select-text">
          {message.transcription.fullText}
        </div>
      </div>
    </main>
  );
};
