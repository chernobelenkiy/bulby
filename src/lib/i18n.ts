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
      home: {
        title: "Unleash Your Creative Potential",
        subtitle: "Transform your thoughts into brilliant ideas with AI assistance",
        getStarted: "Get Started",
        features: {
          title: "Smart Features",
          ideaGeneration: {
            title: "AI-Powered Idea Generation",
            description: "Generate innovative ideas using advanced AI and proven creative techniques"
          },
          organization: {
            title: "Smart Organization",
            description: "Organize and categorize your ideas efficiently with intuitive tools"
          },
          collaboration: {
            title: "Seamless Collaboration",
            description: "Share and collaborate on ideas with team members and stakeholders"
          }
        },
        methods: {
          title: "Idea Generation Methods",
          subtitle: "We use proven creative techniques enhanced by artificial intelligence",
          disney: {
            title: "Disney Method",
            description: "Analyze ideas from three perspectives: Dreamer, Realist, and Critic"
          },
          brainstorming: {
            title: "Brainstorming",
            description: "Generate numerous ideas without judgment to find innovative solutions",
            ideas: "Idea Notes",
            applications: "Application Areas",
            innovation: "Innovation Factors"
          },
          scamper: {
            title: "SCAMPER",
            description: "Transform existing ideas using Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, and Reverse",
            technique: "SCAMPER Technique",
            implementation: "Implementation",
            challenges: "Challenges"
          },
          sixHats: {
            title: "Six Thinking Hats",
            description: "Evaluate ideas from multiple perspectives to identify all aspects of a solution",
            yellowGreen: "Benefits & Creativity",
            whiteBlue: "Facts & Overview",
            blackRed: "Risks & Emotions"
          },
          mindMapping: {
            title: "Mind Mapping",
            description: "Visually organize information to find connections between ideas and concepts",
            insights: "Central Concept & Insights",
            applications: "Applications & Connections",
            branches: "Main Branches"
          }
        }
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
        tokens: "Tokens: {{balance}}",
        tokenCost: "Cost: {{cost}} tokens",
        notEnoughTokens: "You don't have enough tokens to use this method (cost: {{cost}} tokens). Your tokens will refresh tomorrow.",
        dailyLimit: "Daily limit: 200 tokens",
        methods: {
          disney: {
            name: "Disney Method",
            description: "Analyze ideas from three perspectives: Dreamer, Realist, and Critic"
          },
          brainstorming: {
            name: "Brainstorming",
            description: "Generate numerous ideas without judgment to find innovative solutions",
            ideas: "Idea Notes",
            applications: "Application Areas",
            innovation: "Innovation Factors"
          },
          scamper: {
            name: "SCAMPER",
            description: "Transform existing ideas using Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, and Reverse",
            technique: "SCAMPER Technique",
            implementation: "Implementation",
            challenges: "Challenges"
          },
          sixHats: {
            name: "Six Thinking Hats",
            description: "Evaluate ideas from multiple perspectives to identify all aspects of a solution",
            yellowGreen: "Benefits & Creativity",
            whiteBlue: "Facts & Overview",
            blackRed: "Risks & Emotions"
          },
          mindMapping: {
            name: "Mind Mapping",
            description: "Visually organize information to find connections between ideas and concepts",
            insights: "Central Concept & Insights",
            applications: "Applications & Connections",
            branches: "Main Branches"
          }
        },
        tooltips: {
          brainstorming: "Brainstorming helps you generate many ideas without judgment. Write down every idea that comes to mind, focusing on quantity over quality initially. This allows creativity to flow freely without self-censorship. After generating many ideas, you can evaluate and refine the most promising ones.",
          scamper: "SCAMPER is a creative technique that helps you improve ideas by: Substitute (replace parts), Combine (merge elements or ideas), Adapt (alter for a new use or purpose), Modify (change attributes like size or frequency), Put to another use (find new ways to use it), Eliminate (remove elements or simplify), and Reverse (consider opposite perspectives or arrangements).",
          sixHats: "Six Thinking Hats helps you look at problems from different perspectives: White Hat (focus on available data and facts), Red Hat (express feelings and intuition without justification), Black Hat (identify difficulties, dangers, and potential problems), Yellow Hat (focus on benefits and value), Green Hat (creative thinking and new ideas), and Blue Hat (manage the thinking process and focus).",
          mindMapping: "Mind Mapping helps you organize information visually. Start with a central idea and branch out with related concepts to discover new connections. This technique helps visualize relationships between concepts, improves memory retention, and can reveal unexpected connections. The spatial organization makes complex information easier to understand and recall.",
          disney: "The Disney Method analyzes ideas from three perspectives: Dreamer (what's possible, without limitations), Realist (how to implement the idea practically), and Critic (evaluate potential problems and suggest improvements). By cycling through these three roles, you can develop well-rounded ideas that are both innovative and practical."
        }
      },
      ideas: {
        title: "My Ideas",
        noIdeas: "You haven't generated any ideas yet.",
        create: "Create New Idea",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        editIdea: "Edit Idea",
        deleteIdea: "Delete Idea",
        deleteConfirmation: "Are you sure you want to delete the idea \"{{title}}\"? This action cannot be undone.",
        retry: "Retry"
      }
    }
  },
  ru: {
    translation: {
      app: {
        name: "Bulby",
        slogan: "Генерируйте инновационные идеи с помощью ИИ"
      },
      nav: {
        home: "Главная",
        app: "Генерировать Идеи",
        myIdeas: "Мои Идеи",
        signin: "Войти",
        signout: "Выйти"
      },
      home: {
        title: "Раскройте свой творческий потенциал",
        subtitle: "Превратите свои мысли в блестящие идеи с помощью искусственного интеллекта",
        getStarted: "Начать",
        features: {
          title: "Умные функции",
          ideaGeneration: {
            title: "Генерация идей с помощью ИИ",
            description: "Создавайте инновационные идеи с использованием передового ИИ и проверенных творческих методик"
          },
          organization: {
            title: "Умная организация",
            description: "Эффективно организуйте и категоризируйте свои идеи с помощью интуитивно понятных инструментов"
          },
          collaboration: {
            title: "Удобное сотрудничество",
            description: "Делитесь идеями и сотрудничайте с членами команды и заинтересованными сторонами"
          }
        },
        methods: {
          title: "Методы генерации идей",
          subtitle: "Мы используем проверенные творческие методики, улучшенные искусственным интеллектом",
          disney: {
            title: "Метод Диснея",
            description: "Анализ идей с трех позиций: Мечтатель, Реалист и Критик"
          },
          brainstorming: {
            title: "Мозговой штурм",
            description: "Генерация множества идей без критики для поиска инновационных решений",
            ideas: "Заметки к идее",
            applications: "Области применения",
            innovation: "Факторы инноваций"
          },
          scamper: {
            title: "СКАМПЕР",
            description: "Трансформация существующих идей с помощью Замены, Комбинирования, Адаптации, Модификации, Применения в другой области, Исключения и Обращения",
            technique: "Техника СКАМПЕР",
            implementation: "Реализация",
            challenges: "Проблемы и решения"
          },
          sixHats: {
            title: "Шесть шляп мышления",
            description: "Оценка идей с разных точек зрения для выявления всех аспектов решения",
            yellowGreen: "Преимущества и Креативность",
            whiteBlue: "Факты и Обзор",
            blackRed: "Риски и Эмоции"
          },
          mindMapping: {
            title: "Интеллект-карта",
            description: "Визуальная организация информации для нахождения связей между идеями и концепциями",
            insights: "Центральная концепция и Выводы",
            applications: "Применение и Связи",
            branches: "Основные ветви"
          }
        }
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
        tokens: "Токены: {{balance}}",
        tokenCost: "Стоимость: {{cost}} токенов",
        notEnoughTokens: "У вас недостаточно токенов для использования этого метода (стоимость: {{cost}} токенов). Ваши токены обновятся завтра.",
        dailyLimit: "Дневной лимит: 200 токенов",
        methods: {
          disney: {
            name: "Метод Диснея",
            description: "Анализ идей с трех позиций: Мечтатель, Реалист и Критик"
          },
          brainstorming: {
            name: "Мозговой штурм",
            description: "Генерация множества идей без критики для поиска инновационных решений",
            ideas: "Заметки к идее",
            applications: "Области применения",
            innovation: "Факторы инноваций"
          },
          scamper: {
            name: "СКАМПЕР",
            description: "Трансформация существующих идей с помощью Замены, Комбинирования, Адаптации, Модификации, Применения в другой области, Исключения и Обращения",
            technique: "Техника СКАМПЕР",
            implementation: "Реализация",
            challenges: "Проблемы и решения"
          },
          sixHats: {
            name: "Шесть шляп мышления",
            description: "Оценка идей с разных точек зрения для выявления всех аспектов решения",
            yellowGreen: "Преимущества и Креативность",
            whiteBlue: "Факты и Обзор",
            blackRed: "Риски и Эмоции"
          },
          mindMapping: {
            name: "Интеллект-карта",
            description: "Визуальная организация информации для нахождения связей между идеями и концепциями",
            insights: "Центральная концепция и Выводы",
            applications: "Применение и Связи",
            branches: "Основные ветви"
          }
        },
        tooltips: {
          brainstorming: "Мозговой штурм помогает генерировать множество идей без критики. Записывайте каждую идею, которая приходит в голову, делая акцент на количестве, а не на качестве. Это позволяет творчеству течь свободно без самоцензуры. После генерации большого количества идей вы можете оценить и доработать наиболее перспективные.",
          scamper: "СКАМПЕР - это творческая методика, помогающая улучшать идеи с помощью: Замены (замена частей), Комбинирования (объединение элементов или идей), Адаптации (изменение для нового использования), Модификации (изменение атрибутов, например, размера или частоты), Применения в другой области (поиск новых способов использования), Исключения (удаление элементов или упрощение) и Обращения (рассмотрение противоположных перспектив).",
          sixHats: "Шесть шляп мышления помогают рассматривать проблемы с разных точек зрения: Белая шляпа (факты и информация), Красная шляпа (интуиция и эмоции), Черная шляпа (риски и проблемы), Желтая шляпа (преимущества и ценность), Зеленая шляпа (креативное мышление и новые идеи), Синяя шляпа (управление процессом мышления и фокусировка).",
          mindMapping: "Интеллект-карта помогает визуально организовать информацию. Начните с центральной идеи и развивайте связанные концепции, чтобы обнаружить новые связи. Эта техника помогает визуализировать отношения между понятиями, улучшает запоминание и может выявить неожиданные связи. Пространственная организация делает сложную информацию более понятной и легкой для запоминания.",
          disney: "Метод Диснея анализирует идеи с трех позиций: Мечтатель (что возможно, без ограничений), Реалист (как практически реализовать идею) и Критик (оценка потенциальных проблем и предложение улучшений). Циклически проходя через эти три роли, вы можете разработать всесторонние идеи, которые одновременно инновационные и практичные."
        }
      },
      ideas: {
        title: "Мои Идеи",
        noIdeas: "Вы еще не сгенерировали ни одной идеи.",
        create: "Создать Новую Идею",
        edit: "Редактировать",
        delete: "Удалить",
        save: "Сохранить",
        cancel: "Отмена",
        editIdea: "Редактировать Идею",
        deleteIdea: "Удалить Идею",
        deleteConfirmation: "Вы уверены, что хотите удалить идею \"{{title}}\"? Это действие нельзя отменить.",
        retry: "Повторить",
        description: "Описание",
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