"use client";
import {type SubmitEvent, useState} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type User } from "@/entities/user/model/types";
import { FormInput } from "@/shared/ui/inputs/FormInput";
import { Submit } from "@/shared/ui/buttons/Submit";

export function LoginForm() {
    const router = useRouter();

    const [login, setLogin] = useState<string>("")
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    login,
                    password
                })
            });

            if (!response.ok) {
                setError("Неверный логин или пароль");
                return;
            }

            const { user } = (await response.json()) as { user: User };

            if (user.role === "operator") {
                router.replace("/operator");
                return;
            }

            router.replace("/client");
        } catch (error) {
            setError("Не удалось выполнить вход");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex flex-col items-center justify-center gap-6 bg-white border-muted border-1 rounded-2xl p-6'>
            <Image src='/icon.png' className="w-16 h-16" width={128} height={128} alt='copilot icon'/>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-3 items-center">
                    {error && <span className="text-red-500 text-center">Неверные данные для входа</span>}
                    <FormInput
                        id='login'
                        onChange={(event) => setLogin(event.target.value)}
                        value={login}
                        placeholder={'Логин'}
                        autocomplete='login'
                    />

                    <FormInput
                        id='password'
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        placeholder={'Пароль'}
                        autocomplete='password'
                    />
                </div>
                <Submit>
                    {loading ? "Вход..." : "Войти"}
                </Submit>
            </form>
        </div>

    )
}