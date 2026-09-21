import React, { useState } from 'react';
import { X, Send, Bot, Check, Copy, ExternalLink, ShieldCheck, Zap, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { TelegramBotStatus } from '../types';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  botStatus: TelegramBotStatus | null;
  onSaveToken: (token: string) => Promise<boolean>;
  onSimulateMessage: () => void;
  isSimulating: boolean;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({
  isOpen,
  onClose,
  botStatus,
  onSaveToken,
  onSimulateMessage,
  isSimulating,
}) => {
  const [activeTab, setActiveTab] = useState<'connect' | 'guide' | 'usage'>('connect');
  const [tokenInput, setTokenInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const webhookUrl = `${currentOrigin}/api/telegram/webhook`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMsg('Пожалуйста, введите токен бота');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsSaving(true);

    try {
      const ok = await onSaveToken(tokenInput.trim());
      if (ok) {
        setSuccessMsg('Бот успешно подключен! Webhook активирован.');
        setTokenInput('');
      } else {
        setErrorMsg('Не удалось подключить бота. Проверьте правильность токена.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ошибка соединения с Telegram');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center border border-sky-200">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Интеграция с Telegram</h2>
              <p className="text-xs text-slate-500">Автоматический сбор голосовых сообщений и отправка саммари</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-6 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'connect'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Подключение бота
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Инструкция за 30 сек
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'usage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Как это работает
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'connect' && (
            <div className="space-y-5">
              {/* Bot status banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  botStatus?.isConfigured
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                <div className="mt-0.5">
                  {botStatus?.isConfigured ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1 text-xs">
                  {botStatus?.isConfigured ? (
                    <div>
                      <span className="font-bold text-sm text-emerald-800">Бот активен и готов к работе!</span>
                      <p className="mt-1 text-emerald-700">
                        Подключен: <b>@{botStatus.botUsername}</b> ({botStatus.botName}). Входящие голосовые сообщения автоматически принимаются через Webhook.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-sm text-amber-800">Telegram бот пока не настроен</span>
                      <p className="mt-1 text-amber-700">
                        Создайте бота в @BotFather и вставьте его токен ниже. Вы также можете нажать кнопку «Быстрый тест», чтобы оценить инфографику на демо-сообщениях.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Telegram Bot Token (HTTP API)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="123456789:AAHkL12_ExampleTokenXYZ..."
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Получите токен у официального бота <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium">@BotFather</a> в Telegram
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
                    {successMsg}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    {isSaving ? 'Проверка токена...' : 'Сохранить и подключить'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSimulateMessage();
                      onClose();
                    }}
                    disabled={isSimulating}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Быстрый тест (без бота)</span>
                  </button>
                </div>
              </form>

              {/* Webhook info */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">Ваш Webhook URL:</span>
                  <button
                    onClick={handleCopyWebhook}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {copiedWebhook ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedWebhook ? 'Скопировано!' : 'Копировать'}</span>
                  </button>
                </div>
                <div className="px-3 py-2 rounded-lg bg-slate-100 font-mono text-[11px] text-slate-600 select-all break-all border border-slate-200">
                  {webhookUrl}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Наш сервер автоматически регистрирует этот адрес в Telegram при сохранении токена.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs">
              <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Откройте @BotFather в Telegram</h4>
                  <p className="text-slate-600 mt-0.5">
                    Найдите официального бота с синей галочкой: <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium">t.me/BotFather</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Создайте нового бота</h4>
                  <p className="text-slate-600 mt-0.5">
                    Отправьте команду <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">/newbot</code>, укажите имя (например, <i>Мой Саммари Бот</i>) и юзернейм с окончанием на bot (например, <i>my_voice_summary_bot</i>).
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Скопируйте HTTP API токен</h4>
                  <p className="text-slate-600 mt-0.5">
                    @BotFather пришлет сообщение с токеном вида <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">7123456789:ABC...</code>. Вставьте его во вкладку «Подключение бота».
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Готово к использованию!</h4>
                  <p className="text-slate-600 mt-0.5">
                    Пересылайте боту любые аудиосообщения или добавьте бота в ваши рабочие чаты.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <h4 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  Как обрабатываются сообщения:
                </h4>
                <p>
                  1. <b>Пересылка сообщений:</b> Пересылайте боту любые голосовые сообщения или видеосообщения («кружочки») из любых диалогов.
                </p>
                <p>
                  2. <b>Группы и каналы:</b> Вы можете добавить бота в группу с коллегами или друзьями. Бот будет автоматически анализировать голосовые и сразу выдавать короткую выжимку.
                </p>
                <p>
                  3. <b>Мгновенный ответ:</b> Бот отправит в чат Telegram структурированный список решений и задач, а также ссылку на красивую визуальную инфографику в этом дашборде.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-slate-800 block mb-1">🎙️ Голосовые заметки</span>
                  <p className="text-[11px] text-slate-500">
                    Записывайте свои мысли на ходу — приложение структурирует их в списки дел и идеи.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-slate-800 block mb-1">📊 Наглядные графики</span>
                  <p className="text-[11px] text-slate-500">
                    Распределение тем, таймлайн созвона, уровень срочности и экономия времени.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">TeleVoice Bot v2.0 • Powered by Gemini AI</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
