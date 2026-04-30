# CLAUDE.md - SecondBrain Project Instructions

This file provides context and instructions for Claude AI to work on this codebase.

## Project Overview

**SecondBrain** is a personal bookmarking application that allows users to save and organize content from multiple platforms including Twitter/X, YouTube, Instagram, Reddit, GitHub, LinkedIn, Spotify, SoundCloud, and Loom.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, TypeScript
- **Backend**: Express.js, MongoDB (Mongoose), JWT, Zod
- **Optional**: Qdrant (vector database) + Cohere AI (embeddings) for semantic search

## Key Commands

### Frontend
```bash
cd frontend
npm run dev      # Start dev server on port 5173
npm run build    # Production build
```

### Backend
```bash
cd backend
npm run dev      # Start dev server on port 3001
npm run build    # TypeScript build
```

## Important Patterns

### Authentication
- JWT tokens stored in localStorage
- Bearer token format: `Authorization: Bearer <token>`
- Protected routes use `authMiddleware`

### Content Types
Supported: `youtube`, `twitter`, `instagram`, `reddit`, `github`, `linkedin`, `spotify`, `soundcloud`, `loom`

### Database
- MongoDB connection in `backend/src/db/db.ts`
- User, Content, Tag, and Link models defined there
- Zod schemas for validation in `backend/src/types/Schemas.ts`

### API Structure
- User routes: `/v1/user` (register, login)
- Content routes: `/v1/content` (CRUD operations)
- Brain routes: `/v1/brain` (sharing)

## Current Features

1. **Authentication**: Sign up, login, logout with JWT
2. **Bookmarking**: Save links with title, type, and tags
3. **Dashboard**: Grid view with filters by content type
4. **Sidebar**: Toggleable with localStorage preference
5. **Embeds**: oEmbed API for Twitter, Reddit, Instagram; iframes for YouTube, Spotify, Loom
6. **Sharing**: Generate public share links
7. **Pagination**: Backend and frontend support
8. **404 Page**: For unknown routes

## Common Tasks

### Adding a New Content Type
1. Add type to `backend/src/types/Schemas.ts`
2. Add icon to `frontend/src/icons/`
3. Add embed/oembed logic to `frontend/src/components/Card.tsx`
4. Add filter to `frontend/src/pages/Dashboard.tsx`
5. Add button to `frontend/src/components/ContentModal.tsx`

### Modifying Authentication
- Auth routes in `backend/src/routes/UserRouter.ts`
- JWT secret in `backend/.env` (JWT_SECRET)
- Token verification in `backend/src/middleware/authMiddleware.ts`

### Database Changes
- Models in `backend/src/db/db.ts`
- Zod schemas in `backend/src/types/Schemas.ts`

## Styling

- Uses Tailwind CSS
- Editorial aesthetic with Playfair Display (headings) + DM Sans (body)
- Stone color palette (#fafaf9 background)
- Minimal borders, rounded-sm corners

## Environment Variables

### Frontend
- `VITE_BACKEND_URL` - Backend URL for API calls

### Backend
- `PORT` - Server port (default 3001)
- `META_PUBLIC_MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `COHERE_API_KEY` - For embeddings (optional)
- `QDRANT_URL` & `QDRANT_API_KEY` - For vector search (optional)

## Known Issues

- Twitter embeds may be blocked by ad blockers in development
- MongoDB Atlas requires IP whitelist for production access

## File Locations

- Frontend entry: `frontend/src/main.tsx`
- Backend entry: `backend/src/index.ts`
- Routes: `backend/src/routes/`
- Components: `frontend/src/components/`
- Pages: `frontend/src/pages/`

## Design Principles

1. Keep authentication simple with JWT
2. Use oEmbed APIs when available for rich embeds
3. Fall back to links when embeds unavailable
4. Store user preferences in localStorage
5. Handle errors gracefully with appropriate UI feedback