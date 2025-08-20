import createUserQueryOptions from "../../../queries/createUserQueryOptions";
import { useQuery } from "@tanstack/react-query";
import useHandles from "../../../hooks/useHandles"
import { ButtonLogout } from "../../ui/button";
import { LineSpinner } from "ldrs/react";
import 'ldrs/react/LineSpinner.css'

export default function Header() {
    const { handleLogOut } = useHandles();

    const { data, error } = useQuery(createUserQueryOptions())

    if (!data || error) return (
        <header className="bg-[#111827] flex justify-between gap-3 px-3 md:px-8 py-6 mb-[1rem]">
            <LineSpinner size="36" stroke="3" speed="1" color="white" />
            <nav className="flex gap-2 items-center justify-start">
                <section className="flex items-center gap-2">
                    <LineSpinner size="36" stroke="3" speed="1" color="white" />
                </section>
                {/* user options dropdown */}
                <LineSpinner size="36" stroke="3" speed="1" color="white" />
                {/* user info sidebar */}
            </nav>
        </header>
    );

    <LineSpinner size="36" stroke="3" speed="1" color="white" />

    return (
        <header className="bg-[#111827] flex justify-between gap-3 px-3 md:px-8 py-6 mb-[1rem]">
            <section className="flex items-center gap-2">
                <img src="/delta-svgrepo-com.svg" alt="svgrepo delta logo" width={40} height={40} color="white"/>
                <h1 className="text-3xl font-secondary">Kanban</h1>
            </section>
            
            <nav className="flex gap-2 items-center justify-start">
                <section className="flex items-center gap-2">
                    <img src="/profile-picture.jpg" alt="user profile picture" className="w-10 h-10 bg-blue-200 rounded-full overflow-hidden object-fill"/>
                    <p className="text-base font-secondary">{data.username}</p>
                </section>
                {/* user options dropdown */}
                <ButtonLogout className="" onClick={() => handleLogOut()}>Logout</ButtonLogout>
                {/* user info sidebar */}
            </nav>
        </header>
    )
}

