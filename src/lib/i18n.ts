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
        generateButton: "Generate Ideas"
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
        generateButton: "Сгенерировать Идеи"
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