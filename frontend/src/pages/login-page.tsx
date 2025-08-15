import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Slide, ToastContainer } from 'react-toastify';
import { login } from "../lib/api"
import { useNavigate } from "react-router";
import { InputLogin } from "../components/ui/input";
import type { UserCredentials } from "../types/types";
import { ButtonLogin } from "../components/ui/button";
import { showToastSuccess, showToastError } from "../lib/toast-utils";

export default function LoginPage() {
    const [ user, setUser ] = useState<UserCredentials>({username: '', password: ''});
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutate: mutateLogin } = useMutation({ mutationFn: ({username, password}: {username: string, password: string}) => login(username, password),
                onSuccess: () => {
                    showToastSuccess('User logged in successfully')
                    queryClient.invalidateQueries();

                    setTimeout(() => {
                        navigate('/kanban');
                    }, 500);
                },
                onError: (error: Error) => {
                            showToastError(error.message);
                        }
            });

    const handleLogin = async (username: string, password: string) => {
            mutateLogin({username, password})
            setUser({username: username, password: password})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleLogin(user.username, user.password);
    }

    return (
        <main className="h-full w-full flex items-center justify-center bg-primary">
            <form autoComplete="off" className="h-full max-h-[25rem] w-[25rem] rounded-md bg-secondary p-4 flex flex-col items-center justify-center gap-4 shadow-[0px_0px_10px_0px_#2a4365]" onSubmit={handleSubmit}>
                <h1 className="self-start text-2xl">Login</h1>
                <article className="w-full max-w-[25rem] space-y-3">
                    <label htmlFor="username" className="flex flex-col gap-1 text-[0.875rem] font-secondary font-semibold">Username
                        <InputLogin type="text"
                            value={user.username}
                            onChange={(e) => {setUser({username: e.target.value, password: user.password})}}
                                />
                    </label>
                    <label htmlFor="password" className="flex flex-col gap-1 text-[0.875rem] font-secondary font-semibold">Password
                        <InputLogin type="password"
                            value={user.password}
                            onChange={(e) => {setUser({username: user.username, password: e.target.value})}}/>
                    </label>
                </article>
                <ButtonLogin type="submit"/>
            </form>
            <ToastContainer position="bottom-center"
                            autoClose={2500}
                            hideProgressBar
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss={false}
                            draggable={false}
                            pauseOnHover
                            theme="colored"
                            transition={Slide}
                             />
        </main>
    )
}
