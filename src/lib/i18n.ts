'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define the translation resources directly for immediate access
const resources = {
  en: {
    translation: {
      app: {
        name: "Idea Generator",
        slogan: "Generate innovative ideas with AI"
      },
      nav: {
        home: "Home",
        app: "Generate Ideas",
        myIdeas: "My Ideas",
        signin: "Sign In",
        signout: "Sign Out"
      },
      promo: {
        title: "Unleash Your Creativity",
        description: "Struggling with inspiration? Let our AI-powered idea generator help you discover new concepts for your projects.",
        cta: "Get Started"
      },
      auth: {
        telegramLogin: "Login with Telegram",
        signInTitle: "Sign In"
      },
      generator: {
        title: "Idea Generator",
        selectMethod: "Select a method:",
        generateButton: "Generate Ideas",
        prompt: "Type your prompt here...",
        send: "Send",
        generating: "Generating...",
        welcome: "Hi there! I'm your AI assistant. I can help you generate ideas using different methods. Select a method to get started.",
        methodSelected: "You've selected the {{methodName}} method. {{methodDescription}} What topic would you like to generate ideas for?",
        ideasGenerated: "Here are some ideas based on your prompt: \"{{prompt}}\"",
        error: "Sorry, I encountered an error: {{error}}",
        generalError: "Sorry, there was an error processing your request. Please try again.",
        showDetails: "Show Details",
        hideDetails: "Hide Details",
        saved: "Saved",
        save: "Save",
        savedIdeas: "Saved Ideas ({{count}})",
        dreamerNotes: "Dreamer Notes:",
        realistNotes: "Realist Notes:",
        criticNotes: "Critic Notes:",
        methods: {
          disney: {
            name: "Disney Method",
            description: "Analyze ideas from three perspectives: Dreamer, Realist, and Critic"
          }
        }
      },
      ideas: {
        title: "My Ideas",
        noIdeas: "You haven't generated any ideas yet.",
        create: "Create New Idea",
        edit: "Edit",
        delete: "Delete"
      }
    }
  },
  ru: {
    translation: {
      app: {
        name: "Генератор Идей",
        slogan: "Генерируйте инновационные идеи с помощью ИИ"
      },
      nav: {
        home: "Главная",
        app: "Генерировать Идеи",
        myIdeas: "Мои Идеи",
        signin: "Войти",
        signout: "Выйти"
      },
      promo: {
        title: "Раскройте Свой Творческий Потенциал",
        description: "Не хватает вдохновения? Пусть наш генератор идей на базе ИИ поможет вам открыть новые концепции для ваших проектов.",
        cta: "Начать"
      },
      auth: {
        telegramLogin: "Войти через Telegram",
        signInTitle: "Вход"
      },
      generator: {
        title: "Генератор Идей",
        selectMethod: "Выберите метод:",
        generateButton: "Сгенерировать Идеи",
        prompt: "Введите ваш запрос здесь...",
        send: "Отправить",
        generating: "Генерация...",
        welcome: "Привет! Я ваш ИИ-ассистент. Я могу помочь вам генерировать идеи с помощью различных методов. Выберите метод, чтобы начать.",
        methodSelected: "Вы выбрали метод {{methodName}}. {{methodDescription}} Для какой темы вы хотите сгенерировать идеи?",
        ideasGenerated: "Вот несколько идей на основе вашего запроса: \"{{prompt}}\"",
        error: "Извините, произошла ошибка: {{error}}",
        generalError: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте снова.",
        showDetails: "Показать детали",
        hideDetails: "Скрыть детали",
        saved: "Сохранено",
        save: "Сохранить",
        savedIdeas: "Сохраненные идеи ({{count}})",
        dreamerNotes: "Заметки Мечтателя:",
        realistNotes: "Заметки Реалиста:",
        criticNotes: "Заметки Критика:",
        methods: {
          disney: {
            name: "Метод Диснея",
            description: "Анализ идей с трех позиций: Мечтатель, Реалист и Критик"
          }
        }
      },
      ideas: {
        title: "Мои Идеи",
        noIdeas: "Вы еще не сгенерировали ни одной идеи.",
        create: "Создать Новую Идею",
        edit: "Редактировать",
        delete: "Удалить"
      }
    }
  }
};

// Initialize i18n - keep it simple
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
      defaultNS: 'translation',
    });
}

export default i18n; 