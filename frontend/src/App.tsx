import './App.css'
import Board from './components/blocks/Board';

function App() {

  return (
    <main className='w-full max-w-[90rem] mx-auto h-full bg-orange-300'>
      <h1>Todos</h1>
      <Board />
    </main>
  )
}

export default App
