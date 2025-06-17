import './App.css'
import { useTodos } from './auth/Todo/TodoContext';
import Board from './components/blocks/Board';

function App() {
  const { todos } = useTodos()

  return (
    <>
      <h1>Todos</h1>
      <Board />
      <div className='todos__wrapper'>
        {todos.map((todo) => {
          return (
            <article className="todo__container" key={todo.id}>
              <h3 className="todo__container__title">{todo.title}</h3>
              <p className="todo__container__description">{todo.description}</p>
            </article>
          )
        })}
      </div>
    </>
  )
}

export default App
