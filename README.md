# Idea Generator

A web application for generating and managing creative ideas using AI.

## Features

- **Promo Page**: Learn about the platform's features and benefits
- **AI-Powered Idea Generation**: Generate ideas using various creative methods
- **Interactive Chat**: Refine your ideas through conversation with AI
- **Idea Management**: Save, edit, and organize your ideas
- **Telegram Authentication**: Quick and easy sign-in

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for server-rendered applications
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- [Material UI](https://mui.com/) - React UI component library
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [i18next](https://www.i18next.com/) - Internationalization framework
- [AI SDK](https://github.com/vercel/ai) - AI SDK for building AI-powered applications

## Getting Started

### Prerequisites

- Node.js 16.x or later
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/idea-generator.git
   cd idea-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your database and authentication settings.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Initialize Prisma:
   ```bash
   npx prisma generate
   ```

2. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

## Internationalization

The application supports multiple languages:
- English (default)
- Russian

Language files are located in `public/locales/`.

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/             # API routes
│   ├── app/             # Main application page
│   ├── auth/            # Authentication pages
│   └── ideas/           # Ideas management page
├── components/          # Reusable components
├── lib/                 # Utility libraries
├── prisma/              # Database schema and migrations
├── public/              # Static assets
│   └── locales/         # i18n translation files
└── types/               # TypeScript type definitions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/overview/)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
