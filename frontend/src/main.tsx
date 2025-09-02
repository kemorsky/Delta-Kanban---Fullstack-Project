import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import router from './router/router.tsx'

import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
<QueryClientProvider client={queryClient}>
      <StrictMode>
        <RouterProvider router={router} />
        {/* <Analytics /> */}
      </StrictMode>
</QueryClientProvider>
)
