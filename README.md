# SecondBrain 🧠

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-black.svg)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-green.svg)](https://mongodb.com)

A personal bookmarking app to save and organize your favorite Twitter/X posts and YouTube videos. Access all your saved content in one place — your second brain.

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB

### Installation

```bash
# Install dependencies
cd frontend && pnpm install   # or npm install
cd ../backend && pnpm install   # or npm install

# Start development
cd frontend && pnpm dev     # http://localhost:5173
cd backend && pnpm dev     # http://localhost:3000
```

Open `http://localhost:5173`

---

## Architecture

### Two-Server Setup

```
┌──────────────┐  ┌──────────────┐
│   frontend  │  │   backend   │
│  React 19  │  │  Express   │
│  Vite      │  │   Mongoose │
│ Port 5173  │  │  Port 3000 │
└──────────────┘  └──────────────┘
       │                │
       └────────────────┘
                ▼
         ┌──────────────┐
         │  MongoDB    │
         └──────────────┘
```

### Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React 19, Vite, Tailwind CSS 4, Axios   |
| Rendering| HTML5 iframe (YouTube/Twitter embed)     |
| Backend  | Express, Mongoose, JWT, Zod          |
| Database | MongoDB                               |
| Search   | Qdrant (vector database)               |
| Embedding| Cohere AI                            |

---

## Features

- **Authentication**: User signup/login with JWT tokens
- **Bookmarking**: Save Twitter/X posts and YouTube videos
- **Dashboard**: View all saved content in a unified interface
- **Categories**: Organize by content type (Twitter/YouTube)
- **Search**: Semantic search powered by vector embeddings
- **Sharing**: Share your brain with others via public links
- **Responsive**: Works on desktop and mobile

---

## Scripts

```bash
# Frontend
cd frontend
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Lint code

# Backend
cd backend
pnpm dev          # Start development server
pnpm build        # Build for production
```

---

## Project Structure

```
SecondBrain/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom hooks
│   │   ├── icons/      # Icon components
│   │   └── config.ts   # Configuration
│   └── package.json
├── backend/               # Express backend
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── middleware/# Auth middleware
│   │   ├── db/        # Database models
│   │   ├── utils/     # Utilities
│   │   └── types/    # TypeScript types
│   └── package.json
└── README.md
```

---

## API Endpoints

### User Routes (`/v1/user`)
| Method | Endpoint     | Description           |
|--------|-------------|----------------------|
| POST   | `/register` | Create new account   |
| POST   | `/login`   | Login and get token |

### Content Routes (`/v1/content`)
| Method | Endpoint | Description           |
|--------|----------|----------------------|
| GET    | `/`      | Get all content     |
| POST   | `/`      | Create content    |
| PUT    | `/`      | Update content   |
| DELETE | `/`      | Delete content  |
| POST   | `/search` | Search content  |

### Brain Routes (`/v1/brain`)
| Method | Endpoint | Description            |
|--------|----------|----------------------|
| POST   | `/share` | Generate share link |

---

## Environment Variables

### Backend (.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key
WEBSITE_URL=http://localhost:5173
QDRANT_HOST=localhost
QDRANT_API_KEY=your-api-key
COHERE_API_KEY=your-api-key
```

---

## Troubleshooting

### Build fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install
```

### Type errors

```bash
# Regenerate TypeScript
cd frontend && pnpm build
cd backend && pnpm build
```

### MongoDB connection issues

Ensure MongoDB is running locally or update `MONGODB_URI` in `.env`

---

## License

MIT
