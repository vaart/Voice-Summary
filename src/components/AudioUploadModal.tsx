import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Upload, Loader2, Play, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AudioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessAudio: (payload: {
    audioBase64: string;
    mimeType: string;
    duration: number;
    textContext?: string;
    senderName?: string;
  }) => Promise<void>;
  isProcessing: boolean;
}

export const AudioUploadModal: React.FC<AudioUploadModalProps> = ({
  isOpen,
  onClose,
  onProcessAudio,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textContext, setTextContext] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mime = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMsg('Не удалось получить доступ к микрофону. Проверьте разрешения браузера.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // strip data:audio/xxx;base64,
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    const targetBlob = activeTab === 'record' ? recordedBlob : uploadedFile;

    if (!targetBlob) {
      setErrorMsg('Сначала запишите голос или выберите аудиофайл.');
      return;
    }

    try {
      const base64 = await blobToBase64(targetBlob);
      const duration = activeTab === 'record' ? recordSeconds : 60;
      const mime = targetBlob.type || 'audio/webm';

      await onProcessAudio({
        audioBase64: base64,
        mimeType: mime,
        duration: Math.max(5, duration),
        textContext: textContext.trim(),
        senderName: activeTab === 'record' ? 'Вы (Голосовая запись)' : uploadedFile?.name || 'Аудиофайл',
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ошибка обработки аудио');
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Анализ голосового сообщения</h2>
              <p className="text-xs text-slate-500">Запись через микрофон или загрузка файла Telegram (.ogg, .mp3)</p>
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
            onClick={() => setActiveTab('record')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'record'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Запись с микрофона
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Загрузка файла (.ogg, .mp3, .wav)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'record' ? (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              {/* Record visualizer circle */}
              <div className="relative mb-4">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                )}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform active:scale-95 ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 ring-4 ring-indigo-200'
                  }`}
                >
                  {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              {/* Timer and status */}
              <div className="text-center">
                <span className="font-mono text-2xl font-extrabold text-slate-900 block">
                  {formatSeconds(recordSeconds)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {isRecording
                    ? 'Идет запись... Говорите в микрофон'
                    : recordedBlob
                    ? 'Запись сохранена. Готово к анализу!'
                    : 'Нажмите кнопку для начала записи'}
                </span>
              </div>

              {audioUrl && !isRecording && (
                <div className="mt-4 w-full">
                  <audio src={audioUrl} controls className="w-full h-10 rounded-lg" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center py-8 px-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border-2 border-dashed border-slate-300 cursor-pointer transition-colors group">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 transition-colors mb-2" />
                <span className="text-xs font-bold text-slate-700">
                  {uploadedFile ? uploadedFile.name : 'Выберите файл или перетащите сюда'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Поддерживаются форматы: .ogg, .oga, .mp3, .wav, .m4a, .webm
                </span>
                <input
                  type="file"
                  accept="audio/*,.ogg,.oga,.mp3,.wav,.m4a,.webm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {audioUrl && (
                <div className="w-full">
                  <audio src={audioUrl} controls className="w-full h-10 rounded-lg" />
                </div>
              )}
            </div>
          )}

          {/* Context note input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Дополнительный контекст (необязательно)
            </label>
            <input
              type="text"
              placeholder="Например: Встреча по проекту Alpha, клиент попросил смету..."
              value={textContext}
              onChange={(e) => setTextContext(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing || isRecording || (!recordedBlob && !uploadedFile)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini транскрибирует и строит инфографику...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Запустить AI-анализ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
