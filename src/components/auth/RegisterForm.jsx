'use client'

import Link from "next/link";
import React, { useState } from "react";
import { LoginWithGoogle, registerUser } from '../../lib/firebase/auth';
import { useRouter } from 'next/navigation';
import LoadingButton from "../auth/LoadingBotton";
import { toast } from "sonner";
import { errorMessages } from "../../lib/constants/errorMessages";
import { createUser, getUserByUid } from "../../lib/api/users";

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      toast.error("Las contraseñas deben coincidir");
      setIsLoading(false);
      return;
    }

    try {
      const credential = await registerUser(formData.email, formData.password, formData.displayName);
      const idTokenResult = await credential.user.getIdTokenResult();

      try {
        const userData = {
          uid: credential.user.uid,
          email: formData.email,
          name: formData.displayName
        };

        await createUser(userData);
      } catch (dbError) {

        toast.error("Error al guardar datos de usuario");
        setIsLoading(false);
        return;
      }

      await fetch("/api/login", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idTokenResult.token}`,
        },
      });

      toast.success("Cuenta creada exitosamente");
      router.push("/dashboard");
    } catch (error) {
      setIsLoading(false);
      const errorInfo = errorMessages[error.code] || {
        message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
        toast: 'Error al crear la cuenta'
      };
      setError(errorInfo.message);
      toast.error(errorInfo.toast, {
        className: "bg-red-500 text-white",
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

   const handleGoogleLogin = async () => {
     setError(""); 
     setIsLoading(true); 
   
     try {
       const user = await LoginWithGoogle();  
       const idTokenResult = await user.getIdTokenResult();  
   
       const userData = {
         uid: user.uid,
         email: user.email,
         name: user.displayName || user.email.split('@')[0],  
       };
   
       let existingUser;
       try {
         existingUser = await getUserByUid(user.uid);
       } catch (error) {

        existingUser = null; 
       }
   
       if (!existingUser) {
 
         await createUser(userData);

        } else {

        }
   
 
       const loginResponse = await fetch("/api/login", {
         method: "GET",
         headers: {
           Authorization: `Bearer ${idTokenResult.token}`, 
           
         },
       });
   
       if (!loginResponse.ok) {
         throw new Error('Error al realizar login');
       }
   
 
       router.push("/dashboard");
       toast.success("Inicio de sesión exitoso");
   
     } catch (error) {
 

      toast.error("Error al iniciar sesión con Google", { className: "bg-red-500 text-white" });
     } finally {
 
       setIsLoading(false);
     }
   };
  return (
    <div className="">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
          <div>
            <h2 className="lg:text-5xl text-3xl font-extrabold lg:leading-[55px] dark:text-white text-gray-700">
              Registro sin complicaciones para acceso exclusivo
            </h2>
            <p className="text-sm mt-6 dark:text-white text-gray-700">
              Aplicacion Crud de empleados by Axel Muñoz. 
              <a href="https://axelmsilvadev.vercel.app/" className="text-blue-600 font-semibold p-1 rounded-sm mx-1">Mi sitio web</a>

            </p>
            <p className="text-sm mt-12 dark:text-white text-gray-700">
              ¿Ya tienes una cuenta? <Link href="/login" className="text-blue-600 font-semibold hover:underline ml-1">Ingresa aqui</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md md:ml-auto w-full">
            <h3 className="dark:text-white text-gray-700 text-3xl font-extrabold mb-8">
              Crear una cuenta
            </h3>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="space-y-4">
              <div>
                <input
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="bg-transparent border border-gray-300 w-full text-sm dark:text-white text-gray-700 px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border border-gray-300 w-full text-sm dark:text-white text-gray-700 px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Email address"
                  required
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent border border-gray-300 w-full text-sm dark:text-white text-gray-700 px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-transparent border border-gray-300 w-full text-sm dark:text-white text-gray-700 px-4 py-3.5 rounded-md outline-blue-600"
                  placeholder="Confirmar password"
                  required
                />
              </div>
            </div>

            <div className="!mt-8">
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                text="Crear cuenta"
                loadingText="Cargando..."

              />
            </div>

            <div className="my-4 flex items-center gap-4">
              <hr className="w-full border-gray-300" />
              <p className="text-sm dark:text-white text-gray-700 text-center">or</p>
              <hr className="w-full border-gray-300" />
            </div>

            <div className="space-x-6 flex justify-center">
              <button onClick={handleGoogleLogin} type="button" className="border-none outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="32px" viewBox="0 0 512 512">
                  <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" />
                  <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" />
                  <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" />
                  <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" />
                  <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" />
                  <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;