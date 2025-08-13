import createUserQueryOptions from "../../../queries/createUserQueryOptions";
import { useQuery } from "@tanstack/react-query";
import useHandles from "../../../hooks/useHandles"
import { ButtonLogout } from "../../ui/button";

export default function Header() {
    const { handleLogOut } = useHandles();

    const { data, error } = useQuery(createUserQueryOptions())

    if (!data || error) return <p>Loading...</p>;

    return (
        <header className="bg-[#111827] flex justify-between gap-3 px-3 md:px-8 py-6 mb-[1rem]">
            <h1 className="text-2xl">Welcome, 
                <a>
                    <span> {data.username}</span>
                </a>
            </h1>
            <nav className="flex md:flex-row flex-col gap-2 md:items-center md:justify-start">
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

