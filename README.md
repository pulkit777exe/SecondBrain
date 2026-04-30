# SecondBrain 🧠

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-black.svg)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-green.svg)](https://mongodb.com)

A personal bookmarking app to save and organize content from Twitter/X, YouTube, Instagram, Reddit, GitHub, LinkedIn, Spotify, SoundCloud, and Loom. Access all your saved content in one place — your second brain.

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Optional: Qdrant + Cohere (for semantic search)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SecondBrain

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Configure environment variables
# See Environment Variables section below
```

### Running Development

```bash
# Terminal 1 - Frontend (http://localhost:5173)
cd frontend && npm run dev

# Terminal 2 - Backend (http://localhost:3001)
cd backend && npm run dev
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
│ Port 5173  │  │  Port 3001 │
└──────────────┘  └──────────────┘
       │                │
       └────────────────┘
              ▼
       ┌──────────────┐
       │  MongoDB    │
       │  + Qdrant   │
       └──────────────┘
```

### Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, Axios   |
| Styling    | Editorial design with Playfair Display |
| Backend    | Express, Mongoose, JWT, Zod           |
| Database   | MongoDB                               |
| Search     | Qdrant (vector database)              |
| Embeddings | Cohere AI                            |

---

## Features

- **Multi-platform Support**: Save content from YouTube, Twitter/X, Instagram, Reddit, GitHub, LinkedIn, Spotify, SoundCloud, and Loom
- **Authentication**: Secure signup/login with JWT tokens
- **Dashboard**: View all saved content in a unified interface
- **Filtering**: Filter by content type in the sidebar
- **Search**: Semantic search powered by vector embeddings (optional)
- **Sharing**: Share your brain with others via public links
- **Pagination**: Content is paginated for performance
- **Responsive**: Works on desktop and mobile
- **Dark/Light**: Editorial aesthetic with stone color palette

---

## Scripts

### Frontend

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
```

### Backend

```bash
cd backend
npm run dev      # Start development server
npm run build    # Build for production
```

---

## Project Structure

```
SecondBrain/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components (Card, Modal, etc.)
│   │   ├── pages/         # Page components (Dashboard, SignIn, etc.)
│   │   ├── hooks/         # Custom hooks (useContent)
│   │   ├── icons/        # Icon components
│   │   └── config.ts     # Configuration
│   ├── vercel.json       # Vercel SPA config
│   └── package.json
├── backend/               # Express backend
│   ├── src/
│   │   ├── routes/       # API routes (User, Content, Brain)
│   │   ├── middleware/  # Auth middleware
│   │   ├── db/          # Database models
│   │   ├── utils/       # Utilities (Qdrant, Tags, Embeddings)
│   │   └── types/       # TypeScript types (Zod schemas)
│   └── package.json
├── README.md
└── CLAUDE.md            # Claude AI instructions
```

---

## API Endpoints

### User Routes (`/v1/user`)

| Method | Endpoint    | Description           |
|--------|-------------|----------------------|
| POST   | `/register` | Create new account   |
| POST   | `/login`    | Login and get token  |

### Content Routes (`/v1/content`)

| Method | Endpoint   | Description           |
|--------|------------|----------------------|
| GET    | `/`        | Get all content      |
| POST   | `/`        | Create content       |
| PUT    | `/`        | Update content       |
| DELETE | `/`        | Delete content       |
| POST   | `/search`  | Semantic search      |

### Brain Routes (`/v1/brain`)

| Method | Endpoint   | Description            |
|--------|------------|----------------------|
| POST   | `/share`   | Generate share link  |
| GET    | `/:link`   | Get shared content    |

---

## Supported Content Types

| Platform     | Embed Support    |
|--------------|-----------------|
| YouTube      | ✓ iframe        |
| Twitter/X   | ✓ oEmbed API   |
| Instagram   | ✓ oEmbed API   |
| Reddit      | ✓ oEmbed API   |
| GitHub      | Link only      |
| LinkedIn    | Link only      |
| Spotify     | ✓ iframe       |
| SoundCloud  | Link only     |
| Loom        | ✓ iframe       |

---

## Environment Variables

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:3001
```

### Backend (.env)

```env
PORT=3001
META_PUBLIC_MONGODB_URI=mongodb://localhost:27017/secondbrain
JWT_SECRET=your-secret-key
JWT_PASSWORD=your-password-hash-secret
COHERE_API_KEY=your-cohere-key
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-key
WEBSITE_URL=http://localhost:5173
```

---

## Deployment

### Vercel (Frontend)

1. Connect repository to Vercel
2. Set `VITE_BACKEND_URL` in Vercel environment variables
3. Deploy automatically on push

### Backend (Render/DigitalOcean/AWS)

1. Set all required environment variables
2. Ensure MongoDB IP whitelist includes server IP
3. Deploy and start

---

## Troubleshooting

### Build fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type errors

```bash
# Regenerate TypeScript
cd frontend && npm run build
cd backend && npm run build
```

### MongoDB connection issues

- Ensure MongoDB is running locally or update `META_PUBLIC_MONGODB_URI` in `.env`
- For MongoDB Atlas: add your server IP to Network Access whitelist

### Twitter embeds not loading

- May be blocked by ad blockers in development
- Works in production without blockers

---

## License

MIT