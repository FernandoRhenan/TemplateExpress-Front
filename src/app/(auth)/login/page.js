'use client'

import style from '@/app/(auth)/authForm.module.css'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import image from '@/public/images/white_bg.png'
import Link from 'next/link'

export default function Register() {
   const emailRef = useRef('')
   const passwordRef = useRef('')
   const [isLoading, setIsLoading] = useState(false)

   async function handleSubmit(e) {
      e.preventDefault()

      try {
         setIsLoading(true)
      } catch (error) {
         return toast.error('Ocorreu um erro interno. Estamos trabalhando para consertar.')
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className={style.authPage}>
         <div className={style.image} style={{ backgroundImage: `url(${image.src})` }}></div>
         <div className={style.authContainer}>
            <div className={style.title}>
               <h1>Login</h1>
            </div>
            <form className={style.form} onSubmit={handleSubmit}>
               <label>
                  <span>E-mail:</span>
                  <input type="email" name="email" ref={emailRef} />
               </label>
               <label>
                  <span>Senha:</span>
                  <input type="password" name="password" ref={passwordRef} />
               </label>
               {isLoading ? <button disabled>Aguarde</button> : <button>Enviar</button>}
            </form>
            <span>
               <span>Não possui conta? </span>
               <Link href="/register">Registre uma.</Link>
            </span>
         </div>
      </div>
   )
}
