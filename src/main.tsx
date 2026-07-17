import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './app/ErrorBoundary.tsx';
import './index.css';

const REQUIRED_VARS = ['VITE_GEMINI_API_KEY'] as const;
for (const key of REQUIRED_VARS) {
  if (!import.meta.env[key]) {
    console.warn(`[Auralis] Missing env var: ${key}. AI features will use fallback mode.`);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
