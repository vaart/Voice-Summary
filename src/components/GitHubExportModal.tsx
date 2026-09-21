import React, { useState } from 'react';
import { X, Download, Github, Copy, Check, Terminal, FolderArchive, ArrowRight, ExternalLink } from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПОЗИТОРИЯ.git');
  const [copiedCmds, setCopiedCmds] = useState(false);

  if (!isOpen) return null;

  const commands = `# 1. Перейдите в распакованную папку проекта
cd televoice-summary-app

# 2. Инициализируйте локальный Git-репозиторий
git init

# 3. Добавьте все файлы
git add .

# 4. Сделайте первый коммит
git commit -m "feat: TeleVoice Summary & Infographics"

# 5. Установите главную ветку main
git branch -M main

# 6. Привяжите ваш личный репозиторий
git remote add origin ${repoUrl}

# 7. Отправьте код на GitHub
git push -u origin main`;

  const handleCopy = () => {
    navigator.clipboard.writeText(commands);
    setCopiedCmds(true);
    setTimeout(() => setCopiedCmds(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Экспорт на личный GitHub</h2>
              <p className="text-xs text-slate-500">Скачивание полного исходного кода и инструкция по Git</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Step 1: Download ZIP button */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-950">Шаг 1: Скачайте весь исходный код</h4>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Архив содержит все компоненты, стили, Express-сервер и README.md
                </p>
              </div>
            </div>
            <a
              id="btn-download-project-zip"
              href="/api/project/download-zip"
              download="televoice-summary-app.zip"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Скачать ZIP</span>
            </a>
          </div>

          {/* Step 2: Custom repo URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Шаг 2: URL вашего существующего репозитория на GitHub
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/your-username/your-repo.git"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500">
              Создайте репозиторий в вашем профиле на <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium">github.com/new</a> или скопируйте ссылку на существующий.
            </p>
          </div>

          {/* Step 3: Terminal commands */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-500" />
                Шаг 3: Выполните в терминале вашего компьютера
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {copiedCmds ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmds ? 'Скопировано!' : 'Копировать всё'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto select-all">
              <pre>{commands}</pre>
            </div>
          </div>

          {/* If already has files note */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            💡 <b>Если в вашем репозитории уже есть файлы:</b> используйте команду <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">git pull --rebase origin main</code> перед отправкой, либо <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">git push -u origin main --force</code>.
          </div>

          {/* Step 4: GitHub Pages fix */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
              <span>🌐</span> Как включить сайт на GitHub Pages (без белого экрана):
            </h4>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed text-amber-900/90">
              <li>Откройте ваш репозиторий на GitHub и перейдите во вкладку <b>Settings</b>.</li>
              <li>Слева выберите раздел <b>Pages</b>.</li>
              <li>В пункте <b>Build and deployment &gt; Source</b> переключите с <i>«Deploy from a branch»</i> на <b>«GitHub Actions»</b>.</li>
              <li>
                Готово! Встроенный workflow <code className="bg-amber-100 px-1 rounded font-mono">.github/workflows/deploy.yml</code> автоматически скомпилирует приложение и запустит сайт.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Файл .env не попадает в репозиторий благодаря .gitignore</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
