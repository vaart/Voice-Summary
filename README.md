# TeleVoice Summary & Infographics

Автоматическая транскрипция голосовых сообщений из Telegram с генерацией наглядных саммари, задач и инфографики с помощью Gemini AI.

---

## 🚀 Как выложить проект на свой личный GitHub

1. Откройте терминал в папке с этим проектом.
2. Выполните следующие команды:

```bash
# Инициализация репозитория
git init

# Добавление всех файлов проекта
git add .

# Создание первого коммита
git commit -m "Initial commit: TeleVoice Summary & Infographics"

# Переключение на основную ветку main
git branch -M main

# Привязка к вашему личному репозиторию на GitHub (укажите ваш логин и имя репозитория):
git remote add origin https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПОЗИТОРИЯ.git

# Отправка кода в репозиторий
git push -u origin main
```

> **Примечание:** Если ваш репозиторий на GitHub уже был инициализирован (содержит README или лицензию), используйте:
> ```bash
> git pull --rebase origin main
> git push -u origin main
> ```

---

## 🌐 Публикация на GitHub Pages (исправление белого экрана)

Если вы используете **GitHub Pages** и видите пустую белую страницу:
Браузеры не умеют запускать исходный код TypeScript (`.tsx`) напрямую. GitHub Pages должен отдавать **скомпилированную папку `/docs`**:

1. Зайдите в репозиторий на GitHub: **Settings** -> **Pages**.
2. В блоке **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: выберите **/docs** (вместо `/ (root)`)!
3. Нажмите **Save**.
4. Обновите страницу через 30 секунд — сайт сразу откроется и заработает!

---

## 🛠️ Локальный запуск приложения

1. **Установка зависимостей:**
   ```bash
   npm install
   ```

2. **Настройка переменных окружения:**
   Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```
   Укажите ваш ключ Gemini:
   ```env
   GEMINI_API_KEY="ваш_ключ_из_aistudio"
   TELEGRAM_BOT_TOKEN="токен_бота_от_botfather"
   ```

3. **Запуск в режиме разработки:**
   ```bash
   npm run dev
   ```
   Приложение откроется на [http://localhost:3000](http://localhost:3000).

4. **Сборка для продакшна:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📋 Стек технологий
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Motion
- **Backend**: Node.js, Express, TypeScript (tsx/esbuild)
- **AI Engine**: `@google/genai` (Gemini 3.8 Flash)
- **Telegram Integration**: Telegram Bot Webhook & Updates API
