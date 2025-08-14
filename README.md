# Card Magic FX

A React application that uses Kling AI to generate animated videos from images and prompts.

## Features

- 🎨 Upload images and add prompts to generate animated videos
- ✨ Beautiful UI built with React, TypeScript, and Tailwind CSS
- 🎬 Integration with Kling AI's image-to-video API
- 📱 Responsive design for mobile and desktop
- 🚀 Fast development with Vite

## Development

### Prerequisites

- Node.js 18+
- npm or bun

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/card-magic-fx-main.git
cd card-magic-fx-main
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Create a `.env` file in the root directory:

```env
VITE_KLING_API_KEY=your_kling_api_key_here
```

4. Start the development server:

```bash
npm run dev
# or
bun dev
```

5. (Optional) Start the proxy server for local development:

```bash
npm run proxy
```

The app will be available at `http://localhost:8080`

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

1. **Fork or create a new repository** on GitHub
2. **Push your code** to the `main` or `master` branch
3. **Add your Kling API key** as a GitHub secret:
   - Go to your repository Settings → Secrets and variables → Actions
   - Add a new secret named `VITE_KLING_API_KEY` with your API key
4. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)
   - Folder: `/ (root)`

The GitHub Actions workflow will automatically build and deploy your app when you push to the main branch.

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

## Environment Variables

| Variable                | Description                                        | Required |
| ----------------------- | -------------------------------------------------- | -------- |
| `VITE_KLING_API_KEY`    | Your Kling AI API key                              | Yes      |
| `VITE_KLING_TIMEOUT_MS` | Timeout for video generation (default: 240000)     | No       |
| `VITE_KLING_POLL_MS`    | Polling interval for status checks (default: 3000) | No       |

## API Configuration

The app automatically switches between development and production API endpoints:

- **Development**: Uses local proxy server (`http://localhost:8099`)
- **Production**: Uses direct Kling AI API (`https://api.klingai.com`)

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: GitHub Pages, GitHub Actions

## License

MIT License - see LICENSE file for details
