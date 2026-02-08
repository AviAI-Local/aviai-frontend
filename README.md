# AviAI Frontend

AviAI is an AI-powered aviation interview training platform. This repository contains the React + TypeScript frontend application.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aviai-frontend

# Install dependencies
cd client
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Using Docker

```bash
# Build the image
docker build -t aviai-frontend .

# Run the container
docker run -p 3000:3000 aviai-frontend

# Run in detached mode (background)
docker run -d -p 3000:3000 --name aviai aviai-frontend

# Stop the container
docker stop aviai

# Remove the container
docker rm aviai
```

## Project Structure

```
client/src/
├── api/          # API service calls (axios)
├── assets/       # Static assets (images, icons)
├── components/   # Reusable UI components
├── constants/    # Application constants
├── contexts/     # React contexts for state management
├── pages/        # Page-level components
├── routes/       # Application routing
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── App.tsx       # Main application component
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- Axios
- Formik + Yup
- Lexical (rich text editor)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |

## Environment Variables

Create a `.env` file in the `client` directory:

```
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

## License

MIT License
