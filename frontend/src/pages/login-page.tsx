import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api"
import { useNavigate } from "react-router";
import { InputLogin } from "../components/ui/input";

export default function LoginPage() {
    const [ user, setUser ] = useState({username: '', password: ''});
    const navigate = useNavigate();

    const { mutate: mutateLogin } = useMutation({ mutationFn: ({username, password}: {username: string, password: string}) => login(username, password),
                onSuccess: () => {
                    queryClient.invalidateQueries();
                    navigate('/kanban');
                },
            });

    const handleLogin = async (username: string, password: string) => {
         console.log('Calling login function...');
        try {
            mutateLogin({username, password})
            setUser({username: username, password: password})
            console.log('test')
        } catch (error) {
            console.error('Error logging in:', error)
            throw new Error (`Error logging in: ${error}`);
        };
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleLogin(user.username, user.password);
    }

    const queryClient = useQueryClient();

    return (
        <main className="h-full w-full flex items-center justify-center">
            <form className="h-full max-h-[20rem] w-[20rem] rounded-md bg-blue-700 p-4 flex flex-col items-center justify-center gap-4" onSubmit={handleSubmit}>
                <h1 className="self-start">Login</h1>
                <article className="w-full space-y-3">
                    <label htmlFor="username" className="flex flex-col">Username
                        <InputLogin type="text"
                            value={user.username}
                            onChange={(e) => {setUser({username: e.target.value, password: user.password})}}
                                />
                    </label>
                    <label htmlFor="password" className="flex flex-col">Password
                        <InputLogin type="password"
                            value={user.password}
                            onChange={(e) => {setUser({username: user.username, password: e.target.value})}}/>
                    </label>
                </article>
                
                <button className="bg-green-700 p-3 w-full max-w-[10rem]" type="submit">
                    Login
                </button>
            </form>
        </main>
    )
}
