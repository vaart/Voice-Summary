/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceMessageList } from './components/VoiceMessageList';
import { InfographicsDashboard } from './components/InfographicsDashboard';
import { TelegramModal } from './components/TelegramModal';
import { AudioUploadModal } from './components/AudioUploadModal';
import { INITIAL_VOICE_MESSAGES } from './mockData';
import { VoiceMessage, TelegramBotStatus } from './types';
import { Sparkles, Bot, Mic, AlertCircle } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<VoiceMessage[]>(INITIAL_VOICE_MESSAGES);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    INITIAL_VOICE_MESSAGES[0]?.id || null
  );
  const [botStatus, setBotStatus] = useState<TelegramBotStatus | null>({
    isConfigured: false,
    botUsername: undefined,
    messageCount: INITIAL_VOICE_MESSAGES.length,
  });

  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch initial messages and bot status from server
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [msgRes, botRes] = await Promise.all([
        fetch('/api/messages').catch(() => null),
        fetch('/api/telegram/status').catch(() => null),
      ]);

      if (msgRes && msgRes.ok) {
        const data = await msgRes.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          if (!selectedMessageId || !data.messages.some((m: any) => m.id === selectedMessageId)) {
            setSelectedMessageId(data.messages[0].id);
          }
        }
      }

      if (botRes && botRes.ok) {
        const botData = await botRes.json();
        setBotStatus(botData);
      }
    } catch (e) {
      console.warn('API sync warning:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Telegram bot token
  const handleSaveToken = async (token: string): Promise<boolean> => {
    try {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const res = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, appUrl: currentOrigin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBotStatus({
          isConfigured: true,
          botUsername: data.bot?.username,
          botName: data.bot?.first_name,
          webhookUrl: data.webhookUrl,
          messageCount: messages.length,
        });
        showNotification(`Telegram бот @${data.bot?.username} успешно подключен!`);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Simulate receiving Telegram voice message
  const handleSimulateMessage = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/telegram/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: Math.floor(Math.random() * 3) }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [data.message, ...prev]);
        setSelectedMessageId(data.message.id);
        showNotification(`Новое голосовое от ${data.message.sender.name} получено и обработано!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Process uploaded or recorded audio
  const handleProcessAudio = async (payload: {
    audioBase64: string;
    mimeType: string;
    duration: number;
    textContext?: string;
    senderName?: string;
  }) => {
    setIsProcessingAudio(true);
    try {
      const res = await fetch('/api/audio/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [data.message, ...prev]);
        setSelectedMessageId(data.message.id);
        showNotification('Аудиосообщение успешно транскрибировано, инфографика построена!');
      } else {
        throw new Error(data.error || 'Ошибка распознавания');
      }
    } finally {
      setIsProcessingAudio(false);
    }
  };

  // Toggle action item
  const handleToggleActionItem = async (msgId: string, actionId: string) => {
    // Optimistic UI update
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        return {
          ...msg,
          infographics: {
            ...msg.infographics,
            actionItems: msg.infographics.actionItems.map((act) => {
              if (act.id !== actionId) return act;
              return { ...act, completed: !act.completed };
            }),
          },
        };
      })
    );

    try {
      await fetch(`/api/messages/${msgId}/action-item/${actionId}`, {
        method: 'PATCH',
      });
    } catch (e) {
      console.error('Failed to sync action item status:', e);
    }
  };

  // Delete message
  const handleDeleteMessage = async (msgId: string) => {
    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== msgId);
      if (selectedMessageId === msgId) {
        setSelectedMessageId(filtered[0]?.id || null);
      }
      return filtered;
    });

    try {
      await fetch(`/api/messages/${msgId}`, { method: 'DELETE' });
      showNotification('Сообщение удалено', 'info');
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-slate-800">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        botStatus={botStatus}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onSimulateMessage={handleSimulateMessage}
        onRefresh={loadData}
        isSimulating={isSimulating}
        isRefreshing={isRefreshing}
      />

      {/* App Body Layout: Sidebar + Master Infographic Dashboard */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Voice message feed */}
        <VoiceMessageList
          messages={messages}
          selectedMessageId={selectedMessage?.id || null}
          onSelectMessage={(id) => setSelectedMessageId(id)}
        />

        {/* Center / Right: Detailed Infographics View */}
        {selectedMessage ? (
          <InfographicsDashboard
            key={selectedMessage.id}
            message={selectedMessage}
            onToggleActionItem={handleToggleActionItem}
            onDeleteMessage={handleDeleteMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Bot className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">Нет голосовых сообщений</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Подключите Telegram бота или запишите аудио прямо в браузере для автоматической транскрипции и инфографики.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Записать голосовое
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        botStatus={botStatus}
        onSaveToken={handleSaveToken}
        onSimulateMessage={handleSimulateMessage}
        isSimulating={isSimulating}
      />

      <AudioUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProcessAudio={handleProcessAudio}
        isProcessing={isProcessingAudio}
      />
    </div>
  );
}
