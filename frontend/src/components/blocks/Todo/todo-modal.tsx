import { useTodos } from "../../../auth/Todo/TodoContext"

export default function TodoModal() {
    const { todos, setTodos } = useTodos();

    return (
        <div key={todo.id}>TodoModal</div>
    )
};