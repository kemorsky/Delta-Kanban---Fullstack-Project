import './App.css'
import Board from './components/blocks/Board/Board'
import Header from './components/blocks/Header/Header'
import { Analytics } from "@vercel/analytics/react"

export default function App() {

  return (
    <main className='w-full h-full bg-primary'>
      <Analytics />
      <Header />
      <Board />
    </main>
  )
}