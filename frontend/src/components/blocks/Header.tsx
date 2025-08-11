import useHandles from "../../hooks/useHandles"
import type { Todo } from "../../types/types";

type HeaderProps = {
    todos: Todo[] | null | undefined,
};

export default function Header(props: HeaderProps) {
    const { todos } = props;
    const { handleLogOut } = useHandles();

    const username = todos && todos.length > 0 ? todos[0].user?.username : undefined;

    return (
        <header className="bg-[#111827] flex justify-between gap-3 p-4">
            <h1 className="text-2xl">Welcome, 
                <a>
                    <span> {username}</span>
                </a>
            </h1>
            <section className="flex items-center justify-start gap-2">
                <img src="/profile-picture.jpg" alt="user profile picture" className="w-12 h-12 bg-blue-200 rounded-full overflow-hidden object-fill"/>
                <p className="text-base font-secondary">{username}</p>
                <button onClick={() => handleLogOut()}>Log Out</button>
            </section>
        </header>
    )
}

