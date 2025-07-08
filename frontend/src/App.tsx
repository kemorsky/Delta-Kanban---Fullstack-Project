import './App.css'
import Board from './components/blocks/Board';
// import TodoModal from './components/blocks/todo-modal';

export default function App() {

  return (
    <main className='w-full max-w-[90rem] mx-auto h-full bg-orange-300'>
      <Board />
    </main>
  )
}