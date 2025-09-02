import './App.css'
import Board from './components/blocks/Board/Board'
import Header from './components/blocks/Header/Header'

export default function App() {

  return (
    <main className='w-full h-full bg-primary'>
      <Header />
      <Board />
    </main>
  )
}