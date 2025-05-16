'use client'
import { useRouter } from 'next/navigation'
import style from '@/app/(auth)/authForm.module.css'
import { userValidation } from '@/utils/validation/registerForm'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import image from '@/public/images/white_bg.png'
import Link from 'next/link'

export default function Register() {
   const usernameRef = useRef('')
   const emailRef = useRef('')
   const passwordRef = useRef('')
   const [isLoading, setIsLoading] = useState(false)
   const router = useRouter()

   async function handleSubmit(e) {
      e.preventDefault()

      try {
         setIsLoading(true)

         const username = usernameRef.current.value
         const email = emailRef.current.value
         const password = passwordRef.current.value

         const { error } = userValidation({
            username,
            email,
            password,
         })
         if (error) return toast.error(error.details[0].message)

         const res = await fetch(`http://localhost:8080/api/user`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username,
               email,
               password,
            }),
         })

         const data = await res.json()
         if (res.status != 200) {
            return toast.error(`${data.messages[0].message} ${data.messages[0].action}`)
         }
         if (res.status == 500) {
            throw new Error()
         }

         await handleSendEmail(data.token)

         router.push('/register/confirmation')


      } catch (e) {
         toast.error('Ocorreu um erro interno. Caso persista, entre em contato com o suporte.')
         return
      } finally {
         setIsLoading(false)
      }
   }

   async function handleSendEmail(token) {

      const res = await fetch(`http://localhost:8080/api/email/send-confirmation-token`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            token,
         }),
      })

      const data = await res.json()
      if (res.status == 401) {
         return toast.error(`${data.messages[0].message} ${data.messages[0].action}`)
      }

   }

   return (
      <div className={style.authPage}>
         <div className={style.image} style={{ backgroundImage: `url(${image.src})` }}></div>
         <div className={style.authContainer}>
            <div className={style.title}>
               <h1>Cadastro</h1>
            </div>
            <form className={style.form} onSubmit={handleSubmit}>
               <label>
                  <span>Nome:</span>
                  <input type="text" name="username" ref={usernameRef} />
               </label>
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
               <span>Já possui conta? </span>
               <Link href="/login">Entre.</Link>
            </span>
         </div>
      </div>
   )
}
