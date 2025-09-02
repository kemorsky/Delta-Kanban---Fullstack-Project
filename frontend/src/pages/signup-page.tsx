import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Slide, ToastContainer } from 'react-toastify';
import { signup } from "../lib/api"
import { useNavigate } from "react-router";
import { InputLogin } from "../components/ui/input";
import { Form } from "../components/ui/credentials-form";
import type { UserCredentials } from "../types/types";
import { ButtonSignup } from "../components/ui/button";
import { showToastSuccess, showToastError } from "../lib/toast-utils";

export default function SignupPage() {
    const [ user, setUser ] = useState<UserCredentials>({username: '', password: ''});
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutate: mutateSignup } = useMutation({ mutationFn: ({username, password}: {username: string, password: string}) => signup(username, password),
                onSuccess: () => {
                    showToastSuccess('User signed up successfully')
                    queryClient.invalidateQueries();

                    setTimeout(() => {
                        navigate('/');
                    }, 500);
                },
                onError: (error: Error) => {
                            showToastError(error.message);
                        }
            });

    const handleSignup = async (username: string, password: string) => {
            mutateSignup({username, password})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSignup(user.username, user.password);
        console.log("registered user yippieeeee")
    }

    return (
        <main className="h-full w-full flex items-center justify-center bg-primary">
            <Form onSubmit={handleSubmit}>
                <img src="/delta-svgrepo-com.svg" alt="svgrepo delta logo" width={54} height={54} color="white" className="self-end"/>
                <h1 className="self-start text-2xl">Sign Up</h1>
                <article className="w-full max-w-[25rem] space-y-3">
                    <label htmlFor="username" className="flex flex-col gap-1 text-[0.875rem] font-secondary font-semibold">Username
                        <InputLogin type="text"
                            aria-label="username input"
                            value={user.username}
                            onChange={(e) => {setUser({username: e.target.value, password: user.password})}}
                                />
                    </label>
                    <label htmlFor="password" className="flex flex-col gap-1 text-[0.875rem] font-secondary font-semibold">Password
                        <InputLogin type="password"
                            aria-label="password input"
                            value={user.password}
                            onChange={(e) => {setUser({username: user.username, password: e.target.value})}}/>
                    </label>
                </article>
                <ButtonSignup type="submit"/>
            </Form>
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
