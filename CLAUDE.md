# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack project with separate frontend and backend:

```
/
├── frontEnd/          # React + Vite + TypeScript (port 5173)
│   ├── src/
│   │   ├── api/       # Axios API calls
│   │   ├── components/# Reusable components
│   │   ├── pages/     # Page components (dashboard, systemManage, orderManage, welcome)
│   │   ├── router/    # React Router config (module-based routes)
│   │   ├── store/     # Zustand state management
│   │   ├── types/     # TypeScript type definitions
│   │   ├── hook/      # Custom React hooks
│   │   └── utils/     # Utilities (AntdGlobal, etc.)
│   └── vite.config.ts # Vite config with /api proxy to backend
├── backEnd/           # Node.js Koa server (port 3000)
│   └── src/
│       ├── router/    # Route definitions (dashboard, orderManage, systemManage)
│       ├── controllers/# Request handlers
│       ├── model/     # Data models
│       └── app.js     # Koa app entry point
└── package.json       # Root package (manages backend deps only)
```

## Commands

### Frontend (in frontEnd/ directory)
```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build   # Build for production
npm run lint    # Run ESLint
npm run preview # Preview production build
```

### Backend (in backEnd/ directory)
```bash
node src/app.js  # Start Koa server (http://localhost:3000)
```

### Root
```bash
npm install      # Install backend dependencies (koa, koa-router, cors)
cd frontEnd && npm install  # Install frontend dependencies
```

## Architecture

### Frontend
- **React 19** + TypeScript + **Vite 8** for bundling
- **Ant Design 6** for UI components (theme token: `colorPrimary: #eb6c00`)
- **TailwindCSS 4** for styling (configured via `@tailwindcss/vite` plugin)
- **React Router 7** with module-based route configuration in `router/modules/`
- **Zustand** for global state management
- **ahooks** for React hooks utilities
- **ECharts** for data visualization
- **@amap/amap-jsapi-loader** for AMap (高德地图) integration
- **Axios** for HTTP requests, with API paths prefixed `/api`

### Backend
- **Koa.js** with koa-router for routing
- **koa-body** for request body parsing (JSON, FormData, file uploads)
- **@koa/cors** for cross-origin support
- Routes: `/api` prefixed paths → corresponding controllers

### API Proxy
Frontend Vite dev server proxies `/api/*` requests to `http://localhost:3000` (backend).

## TypeScript Path Alias
`@/` maps to `frontEnd/src/` — use `@/` for absolute imports in frontend code.
