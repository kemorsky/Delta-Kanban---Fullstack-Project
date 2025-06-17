import { useTodos } from "../../../auth/Todo/TodoContext"
import type { Id } from "../../../types/types"

export default function ColumnContent({columnId }: {columnId: Id}) {

    const { todos } = useTodos()

    const columnTodos = todos.filter((todo) => todo.columnId === columnId)

    return (
        <article>
            {columnTodos.map((todo) => {
                return (
                <article className="" key={todo.id}>
                    <h3 className="">{todo.title}</h3>
                    <p className="">{todo.description}</p>
                </article>
                )
            })}
        </article>
    )
}