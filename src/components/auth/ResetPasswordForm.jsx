'use client'

import Link from "next/link";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase/config";
import { useRouter } from 'next/navigation';
import LoadingButton from "../auth/LoadingBotton";
import { toast } from "sonner";
function RessetPasswordForm() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();  
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Se ha enviado un correo para restablecer tu contraseña.", {
                className: "bg-green-500 text-white",
            });

            setMessage("Se ha enviado un correo para restablecer tu contraseña.")
            setIsLoading(false);
        } catch (error) {
            toast.error("Error al enviar el correo. Verifica la dirección de correo.", {
                className: "bg-red-500 text-white",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="font-[sans-serif]">
            <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
                <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
                    <div>
                        <img src="/reset-ui.svg" alt="Login UI" width={400} height={400} />


                        <p className="text-sm mt-12 dark:text-white text-gray-700">Don't have an account <Link href="/register" className="text-blue-600 font-semibold hover:underline ml-1">Register here</Link></p>
                    </div>

                    <form onSubmit={handleResetPassword} className="max-w-md md:ml-auto w-full">
                        <h3 className="dark:text-white text-gray-700 text-3xl font-extrabold mb-8">
                            ¿Olvidaste tu contraseña?
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="bg-transparent border border-gray-300 w-full text-sm dark:text-white text-gray-700 px-4 py-3.5 rounded-md outline-blue-600 " placeholder="Email address" />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">

                                <div className="text-sm">
                                    <Link href="/reset-password" className="text-blue-600 hover:text-blue-500 font-semibold">
                                        Ya tengo una cuenta
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="!mt-8">
                            <LoadingButton
                                type="submit"
                                isLoading={isLoading}
                                text="Enviar correo"
                                loadingText="Cargando..."
                                onClick={handleResetPassword}
                            />
                            <label>{message}</label>
                        </div>

                    </form>
                    {error && (
                        <div className="mt-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RessetPasswordForm;
