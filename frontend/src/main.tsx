import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import router from './router/router.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
<QueryClientProvider client={queryClient}>
      <StrictMode>
        <RouterProvider router={router}/>
          <App />
      </StrictMode>
</QueryClientProvider>
)
