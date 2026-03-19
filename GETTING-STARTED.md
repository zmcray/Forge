# Getting Started with Forge in Claude Code

## Step 1: Install Claude Code (if you haven't already)

Open your terminal and run:
```
npm install -g @anthropic-ai/claude-code
```

If you don't have npm/Node.js, install Node first from https://nodejs.org (LTS version).

## Step 2: Navigate to the Forge Directory

```
cd ~/Work/30_Projects/Forge
```

(Adjust the path if your Work folder is somewhere else on your machine.)

## Step 3: Start a Claude Code Session

```
claude
```

This opens an interactive terminal session. Claude Code will automatically read the CLAUDE.md file in this directory, which contains the full project brief, architecture spec, and the commit-first mechanic design.

## Step 4: Kick Off the Scaffold

Your first message to Claude Code:

```
Scaffold this into a Vite + React + Tailwind project. Extract the existing Forge.jsx into the component architecture described in CLAUDE.md. Keep everything working exactly as it does today... same UI, same data, same flow. We'll change the QuestionCard behavior next.
```

Claude Code will:
1. Initialize a package.json with Vite, React, Tailwind
2. Break Forge.jsx into separate files (data, components, hooks, utils)
3. Set up the build config
4. Make sure it all compiles and runs

## Step 5: Test It

Once Claude Code finishes scaffolding, it should start the dev server for you. If not:

```
npm run dev
```

Open http://localhost:5173 in your browser. Everything should look and work exactly like the old single-file version.

## Step 6: Build the Commit-First Mechanic

Once the scaffold is verified working:

```
Now rebuild QuestionCard with the commit-first mechanic described in CLAUDE.md. The user must enter their answer before they can reveal the model answer.
```

## Tips for Working with Claude Code

- **Be specific about what you want changed.** "Fix the QuestionCard" is vague. "Add a number input for quantitative questions that gates the reveal button" is clear.
- **Ask it to run the dev server** so you can test changes live.
- **If something breaks**, paste the error message and ask Claude Code to fix it.
- **You can ask it to explain what it did** after any change if you want to understand the code.
- **Use `claude` to start a session, `exit` or Ctrl+C to end one.**
- **Your CLAUDE.md is your project memory.** Claude Code reads it every session. Update it as the project evolves.
