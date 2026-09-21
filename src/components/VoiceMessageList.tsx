import React, { useState } from 'react';
import { Search, Clock, Zap, AlertCircle, CheckCircle, ChevronRight, Forward, Sparkles, Filter } from 'lucide-react';
import { VoiceMessage } from '../types';

interface VoiceMessageListProps {
  messages: VoiceMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (id: string) => void;
}

export const VoiceMessageList: React.FC<VoiceMessageListProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  const categories = ['Все', 'Срочно', 'Работа', 'Финансы', 'Идеи'];

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.summary.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.transcription.fullText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Все' || msg.summary.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <aside className="w-full lg:w-96 flex flex-col bg-white border-r border-slate-200 shrink-0 h-[calc(100vh-4rem)]">
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-200/80 space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Голосовые из Telegram ({filteredMessages.length})
          </span>
          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            Live синхронизация
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Поиск по отправителю, темам, тексту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium">Сообщений не найдено</p>
            <p className="text-[11px] text-slate-400">
              Попробуйте изменить поисковый запрос или запишите новое аудио
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelected = msg.id === selectedMessageId;
            const urgencyColor =
              msg.summary.urgency > 75
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : msg.summary.urgency > 50
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <button
                key={msg.id}
                id={`card-msg-${msg.id}`}
                onClick={() => onSelectMessage(msg.id)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200'
                }`}
              >
                {/* Top sender line */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg ${
                        msg.sender.avatarColor || 'bg-indigo-600'
                      } text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                    >
                      {msg.sender.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-xs text-slate-900 block truncate">
                        {msg.sender.name}
                      </span>
                      {msg.forwardedFrom && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                          <Forward className="w-2.5 h-2.5 text-slate-400" />
                          из: {msg.forwardedFrom.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    {formatDate(msg.receivedAt)}
                  </span>
                </div>

                {/* Headline summary */}
                <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed mb-2">
                  {msg.summary.headline}
                </h4>

                {/* Mini Waveform preview */}
                <div className="flex items-end gap-0.5 h-4 mb-2.5 px-1 py-0.5 bg-slate-50 rounded">
                  {(msg.waveform || []).slice(0, 28).map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-full transition-colors ${
                        isSelected ? 'bg-indigo-400' : 'bg-slate-300'
                      }`}
                      style={{ height: `${Math.max(15, val)}%` }}
                    />
                  ))}
                </div>

                {/* Badges footer */}
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDuration(msg.durationSeconds)}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                      <Zap className="w-3 h-3 text-emerald-500" />
                      -{msg.summary.timeSavedPercent}% времени
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md font-semibold border ${urgencyColor}`}>
                    {msg.summary.category}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
