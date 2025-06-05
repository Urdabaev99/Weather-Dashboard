# Weather Dashboard

## Обзор проекта

Основные возможности:

- Выбор города через поиск и выпадающий список.
- Отображение **текущей погоды** (температура, описание, иконка).
- Вкладка **Forecast**: первые 5 записей почасового прогноза в виде карточек.
- Вкладка **Statistics**: таблица среднесуточных значений и линейный график (SVG).
- **Settings**:
    - Единицы измерения (°C / °F).
    - Частота автообновления (5–60 секунд).
    - Показ/скрытие иконок и описания.
- **Тёмная и светлая тема** через Context.
- Все стили на SCSS-модулях.
- Анимация вкладок и панели настроек через `react-transition-group`.

## Инструкция по установке и запуску

1. Клонируйте репозиторий:
    git clone <URL>
    cd <repository_folder>
2. Установите зависимости:
    npm install
    # или
    yarn install
3. Создайте файл окружения `.env` (в корне проекта):
    VITE_API_KEY=ВАШ_API_KEY
    VITE_USE_MOCK=true/false
4. Запустите в режиме разработки:
    npm start
    # или
    yarn dev
    - Открывается `http://localhost:3000`.


## Описание компонентов

### CitySelector

- **Назначение**: выбор города с поиском.
- **Основное**:
    - Поле поиска фильтрует `cities` с `debounce(handleSearch, 300)`.
    - При клике на заголовок открывается/закрывается dropdown.
    - Закрытие при клике вне (хуки для “click outside”).
    - Анимация через `CSSTransition`.

### WeatherDisplay

- **Назначение**: отображает текущую погоду.
- **Основное**:
    - Конвертирует `main.temp` → `toCelsius` / `toFahrenheit`.
    - Отображает:
        - Город
        - Температура + единица
        - Описание (если `showDescription`)
        - Иконка (если `showIcons`)

### ForecastList

- **Назначение**: отображение первых 5 записей прогноза.
- **Основное**:
    - `data.slice(0, 5)`.
    - Каждая карточка:
        - Дата/время (`new Date(point.dt * 1000).toLocaleString()`)
        - Температура (конвертация)
        - Описание / иконка (по флагам)

### DataVisualization

- **Назначение**: таблица среднесуточных значений и SVG-график.

### SettingsPanel

- **Файл**: `src/components/SettingsPanel/SettingsPanel.tsx`
- **Назначение**: панель настроек.
- **Основное**:
    - Переключение единиц: две кнопки “°C” / “°F”.
    - Слайдер `<input type="range" min={5} max={60} step={5}>` для интервала.
    - Чекбоксы: `showIcons`, `showDescription`.
    - Кнопка “Close” → `onCloseSettingPanel(false)`.

### ThemeToggle

- **Файл**: `src/components/UI/ToggleTheme/ThemeToggle.tsx`
- **Назначение**: переключатель тем.
- **Логика**:
    - Использует `ThemeContext` → `{ darkMode, toggleTheme }`.
    - Две кнопки с `MoonIcon`, `SunIcon`.
    - `active` класс на текущую тему.

### SettingButton

- **Назначение**: кнопка “шестерёнка” для открытия SettingsPanel.
- **Основное**:
    - При клике `onOpenSettingPanel(true)`.

### WeatherWidget

- **Назначение**: главный контейнер приложения.

### ErrorBoundary

- **Назначение**: отлавливает ошибки в дочерних компонентах.

## Кастомный хук `useWeatherData`

- **Назначение**: управление состоянием и запросами погоды.


## Утилиты и вспомогательные функции

### debounce

- **Назначение**: задержка вызова функции:

### throttle

- **Назначение**: вызов функции не чаще, чем раз в указанный интервал:

### dateUtils

- **Функции**:
    - `averageDailyValues(data: WeatherDataPoint[]): Record<string, number>`: среднесуточные (группировка по дате).
    - `sortByDateTime(data: WeatherDataPoint[]): WeatherDataPoint[]`: сортировка по `dt`.
    - `findMinMaxAvg(data: WeatherDataPoint[]): { min: number; max: number; avg: number }`: мин и макс  значения`.

### temperature

- **Функции**:
    - `toCelsius(k: number): number` → `(k - 273.15).toFixed(2)`.
    - `toFahrenheit(k: number): number` → `((k - 273.15) * 9/5 + 32).toFixed(2)`.

### classNames

- **Файл**: `src/utils/classNames.ts`
- **Назначение**: объединение классов:


## Контекст темы (ThemeContext)

- **Файл**: `src/context/ThemeContext.tsx`
- **Назначение**: светлая/тёмная тема.


