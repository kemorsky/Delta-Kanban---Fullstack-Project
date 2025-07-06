import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TodoProvider from './auth/Todo/TodoProvider.tsx'
import ColumnProvider from './auth/Column/ColumnProvider.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
<QueryClientProvider client={queryClient}>
  <ColumnProvider>
    <TodoProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </TodoProvider>
  </ColumnProvider>
</QueryClientProvider>
)
