import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TodoProvider from './auth/Todo/TodoProvider.tsx'
import ColumnProvider from './auth/Todo/ColumnProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <ColumnProvider>
    <TodoProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </TodoProvider>
  </ColumnProvider>
)
