import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '@/app/providers/store-provider';
import { ThemeProvider } from '@/app/providers/theme-provider';
import '@/shared/config/i18n/i18n';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StoreProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </BrowserRouter>,
);
