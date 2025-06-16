import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TodoProvider from './auth/Todo/TodoProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <TodoProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </TodoProvider>
)
