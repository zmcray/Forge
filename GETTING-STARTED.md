# Getting Started with Forge

## Prerequisites
- Node.js 20+ (https://nodejs.org, LTS version)
- npm (comes with Node.js)

## Setup

1. Navigate to the Forge app directory:
```
cd ~/Work/30_Projects/Forge/app
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the `app/` directory with your API key:
```
ANTHROPIC_API_KEY=your-key-here
```

4. Start the dev server:
```
npm run dev
```

5. Open http://localhost:5173 in your browser.

## Commands

All commands run from the `app/` directory:

- `npm run dev` ... Vite dev server with HMR
- `npm test` ... run all tests
- `npm run test:watch` ... Vitest in watch mode
- `npm run build` ... production build
- `npm run lint` ... ESLint check
- `npm run format` ... Prettier format check
- `npm run format:fix` ... Prettier auto-fix

## Deployment

Forge auto-deploys to Vercel on push to main. CI runs tests and build via GitHub Actions before deploy.

Live URL: https://forge-six-kappa.vercel.app/

## Working with Claude Code

- Open a Claude Code session from the `Forge/` directory so it picks up the `CLAUDE.md` project brief automatically.
- Be specific about what you want changed. "Fix the QuestionCard" is vague. "Add a number input for quantitative questions that gates the reveal button" is clear.
- Ask Claude to run the dev server so you can test changes live.
- If something breaks, paste the error message and ask Claude to fix it.
