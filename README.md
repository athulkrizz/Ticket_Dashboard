# 🎫 TicketFlow Dashboard

![TicketFlow Dashboard](https://github.com/user-attachments/assets/preview.png)

TicketFlow is a modern, responsive, and full-stack Ticket Management Dashboard. It features a beautiful UI powered by **Angular 19** and **PrimeNG 19** (Aura theme), and a robust backend powered by **NestJS**.

## ✨ Features

- **Full-Stack Architecture**: Complete monorepo separating Angular frontend and NestJS API backend.
- **JWT Authentication**: Secured endpoints with mock user authentication.
- **Interactive Dashboard**:
  - Auto-fitting statistical summary cards (Total, Open, In Progress, Resolved, Closed).
  - Dynamic data table with pagination, sorting, status/priority indicators, and time-ago pipes.
  - Search and filter by status and priority.
- **Detailed Ticket View**:
  - Inline editing of ticket title and descriptions.
  - Interactive comments timeline.
  - Sidebar for quick metadata updates (Priority, Status, Assignee).
- **🤖 AI Assistant Integration**:
  - A mock AI chat panel to suggest ticket priorities, draft replies, and summarize issues.
- **🎨 Dark & Light Mode**: Built-in, fully supported theme toggle using PrimeNG's Aura engine, persisted across sessions.
- **Responsive Layout**: Designed to look and function perfectly across desktops, tablets, and mobile devices.

## 🛠️ Technology Stack

**Frontend**
- [Angular 19](https://angular.dev/) (Standalone Components, Signals)
- [PrimeNG 19](https://primeng.org/) (Aura Theme)
- SCSS & Custom CSS Grid/Flexbox
- TypeScript

**Backend**
- [NestJS 11](https://nestjs.com/)
- Node.js (v22+)
- TypeScript
- JWT (Passport-jwt)
- Express

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v22.12.0 or newer)
- **npm** (v10+)

### 1. Installation

Clone the repository and install all monorepo dependencies:
```bash
git clone https://github.com/yourusername/ticket-dashboard.git
cd ticket-dashboard
npm run install:all
```

### 2. Running Locally

The repository uses `concurrently` to spin up both the backend and frontend simultaneously.

```bash
npm run dev
```

- **Frontend (Angular)** will run at: `http://localhost:4200`
- **Backend API (NestJS)** will run at: `http://localhost:3000`

### 3. Login Credentials

You can use the following mock credentials to log in:
- **Email**: `admin`
- **Password**: `admin123`

## ☁️ Deployment (Vercel)

The repository is configured for serverless deployment on [Vercel](https://vercel.com). It builds the Angular frontend as static files and the NestJS backend as a Serverless API function.

Deploy it simply using the Vercel CLI:
```bash
npm i -g vercel
vercel --prod
```

### Vercel Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist/client/browser`
- The `vercel.json` rewrite rules forward `/api/*` traffic to the root `api/index.js` serverless function adapter.

## 📁 Project Structure

```
ticket-dashboard/
├── api/                    # Vercel serverless function entrypoint
├── client/                 # Angular 19 Frontend
│   ├── src/app/
│   │   ├── core/           # Services (Auth, Tickets, AI), Guards, Interceptors
│   │   ├── features/       # Pages (Login, Dashboard, Ticket Detail)
│   │   └── shared/         # Reusable components (Navbar, AI Chat, Badges)
│   └── styles.scss         # Global PrimeNG theme overrides
├── server/                 # NestJS 11 Backend
│   ├── src/
│   │   ├── ai/             # AI Mocking endpoints
│   │   ├── auth/           # JWT Strategy & Auth Controller
│   │   ├── tickets/        # CRUD Endpoints and In-Memory DB
│   │   └── users/          # Mock user registry
├── vercel.json             # Vercel deployment configuration
└── package.json            # Monorepo scripts
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
