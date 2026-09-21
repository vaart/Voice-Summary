import React from 'react';
import { Mic, Send, Bot, Sparkles, RefreshCw, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { TelegramBotStatus } from '../types';

interface NavbarProps {
  botStatus: TelegramBotStatus | null;
  onOpenTelegramModal: () => void;
  onOpenUploadModal: () => void;
  onSimulateMessage: () => void;
  onRefresh: () => void;
  isSimulating: boolean;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  botStatus,
  onOpenTelegramModal,
  onOpenUploadModal,
  onSimulateMessage,
  onRefresh,
  isSimulating,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">TeleVoice</span>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                AI Инфографика
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Транскрипция и умные саммари голосовых из Telegram
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Telegram Status Pill */}
          <button
            id="btn-telegram-status"
            onClick={onOpenTelegramModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              botStatus?.isConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Настройки подключения к Telegram"
          >
            {botStatus?.isConfigured ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Бот:</span>
                <span className="font-semibold">@{botStatus.botUsername || 'TeleVoiceBot'}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="font-semibold">Подключить Telegram</span>
              </>
            )}
          </button>

          {/* Quick Simulate Button */}
          <button
            id="btn-simulate-tg"
            onClick={onSimulateMessage}
            disabled={isSimulating}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors border border-slate-200 disabled:opacity-60"
            title="Смоделировать входящее голосовое сообщение из Telegram"
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-600 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Обработка...' : 'Тест голосового'}</span>
          </button>

          {/* Direct Audio / Record Button */}
          <button
            id="btn-open-record"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-500/30 transition-all hover:shadow-indigo-500/40"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Записать / Загрузить</span>
            <span className="sm:hidden">Аудио</span>
          </button>

          {/* Refresh Button */}
          <button
            id="btn-refresh-feed"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Обновить список"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
