# Hosting the Monopoly Game

This Monopoly game is a **Client-Side** application that uses **PeerJS** for peer-to-peer multiplayer connectivity. This means it is very easy to host because you generally only need to host the static files.

## Prerequisites
- Node.js (for building the project)
- NPM (Node Package Manager)

## Quick Start (Local)
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Open in Browser**:
    Open the link shown in the terminal (usually `https://localhost:5173/Monopoly/`). Note: You may need to bypass the SSL warning.

## How to Host (Publicly)
Since the app communicates directly between players (Peer-to-Peer), you can host the application on any static site hosting service.

### Option 1: GitHub Pages (Recommended)
1.  Open `package.json` and ensure `"homepage"` is set to your repository URL (e.g., `https://<your-username>.github.io/<repo-name>/`).
2.  Build the project:
    ```bash
    npm run build
    ```
3.  Deploy the `docs` folder (the build output goes here based on the build script) to GitHub Pages.

### Option 2: Vercel / Netlify
1.  Connect your GitHub repository to Vercel or Netlify.
2.  Use the following build settings:
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `docs` (or `dist` if you change the vite config, but the current script copies to `docs`).

## Important Notes
-   **PeerJS Server**: By default, the game connects to the public PeerJS cloud server (`0.peerjs.com`). This works for small tests but has limits. For a serious deployment, you can host your own PeerJS server and update `src/config.ts` with your server details.
-   **Reconnection**: If a player disconnects, they **cannot** rejoin the same session with their previous state.
-   **Security**: The game defaults to `https`. Ensure your host supports HTTPS (GitPages, Vercel, Netlify all do).

## Gameplay
1.  Crate a Room: One person goes to the "Server" tab and clicks "Run Server". They share the generated **Code**.
2.  Join a Room: Other players enter their Name and the Code on the home screen and click "Join".
