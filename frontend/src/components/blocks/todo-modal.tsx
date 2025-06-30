import { useTodos } from "../../auth/Todo/TodoContext";
import type { Todo } from "../../types/types";
import { InputEdit } from "../ui/input";

type TodoModalProps = {
    getTodo: (id: string) => void,
    todoData: Todo | null,
    updateTodo: (columnId: string, id: string, title: string, description: string) => void,
    removeTodo: (columnId: string, id: string) => void,
    editTitle: string | null | undefined,
    setEditTitle: React.Dispatch<React.SetStateAction<string | null >>,
    editDescription: string | null | undefined,
    setEditDescription: React.Dispatch<React.SetStateAction<string | null >>,
};

export default function TodoModal(props: TodoModalProps) {

    const { setTodos } = useTodos();
    const { todoData, updateTodo, removeTodo, editTitle, setEditTitle, editDescription, setEditDescription } = props

    if (!todoData) return;

    return (
        <article className="bg-green-700 mx-auto w-[60rem] h-[30rem] space-y-4 p-6 rounded-2xl border border-gray-300">
            <header className="flex justify-between items-center border-b">
                <article className="pb-4 flex flex-col gap-2">
                    <p>Date</p>
                    <button className="absolute bottom-2 right-2 self-end p-2 bg-red-600" onClick={() => {removeTodo(todoData.columnId, todoData.id)}}>Delete</button>

                    <section className="flex gap-2">
                        <span className="text-3xl">#1</span>
                        {editTitle === todoData.id && (
                            <InputEdit type="text" 
                                    value={todoData.title}
                                    onChange={(e) => {
                                        setTodos((prev) => prev.map((t) => t.id === todoData.id ? {...t, title: e.target.value} : t))
                                    }}
                                    onBlur={(e) => {
                                        updateTodo(todoData.columnId, todoData.id!, e.target.value, todoData.description!)                                         
                                        console.log(todoData.columnId, todoData.id)
                                        setEditTitle(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                        )}

                        {editTitle !== todoData.id && (
                            <h1 className="text-3xl" onClick={() => setEditTitle(todoData.id ?? '')}>{todoData.title}</h1>
                        )}
                    </section>
                    <section className="flex gap-1.5">
                        <span className="flex items-center gap-1 bg-blue-300 rounded px-2 py-1 text-sm border border-black">
                            <p>label 1</p>
                            <button className="flex items-center justify-center w-6 h-6">x</button>
                        </span>
                        <span className="flex items-center gap-1 bg-blue-300 rounded px-2 py-1 text-sm border border-black">
                            <p>label 2</p>
                            <button className="flex items-center justify-center w-6 h-6">x</button>
                        </span>
                        <button>+ Add Label</button>
                    </section>
                </article>
                <section className="self-start">
                    <button>X</button>
                </section>
            </header>
            <div className="flex justify-between gap-3">
                <article className="w-2/3 flex flex-col gap-4 bg-green-600 px-2 py-4 rounded-md">
                    <section className="flex items-center gap-2">
                        <p>X</p>
                        <h2 className="text-xl">Description</h2>
                    </section>
                    <p className="text-base">Description</p>
                    {editDescription === todoData.id && (
                            <InputEdit type="text" 
                                    value={todoData.description}
                                    onChange={(e) => {
                                        setTodos((prev) => prev.map((t) => t.id === todoData.id ? {...t, description: e.target.value} : t))
                                    }}
                                    onBlur={(e) => {
                                        updateTodo(todoData.columnId, todoData.id!, todoData.title!, e.target.value)                                         
                                        console.log(todoData.columnId, todoData.id)
                                        setEditDescription(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                        )}

                    {editDescription !== todoData.id && (
                        <p onClick={() => setEditDescription(todoData.id ?? '')}>{todoData.description}</p>
                    )}
        
                </article>
                <article className="w-1/3 flex flex-col gap-4 bg-green-800 px-2 py-4 rounded-md">
                    <section className="w-full flex flex-col items-start gap-2">
                        <h2 className="text-xl">Reserved for buttons</h2>
                        <button className="w-full flex items-start px-3 py-1.5">Delete Todo</button>
                        <button className="w-full flex items-start px-3 py-1.5">Delete Todo</button>
                    </section>
                </article>
            </div>
        </article>
    )
};