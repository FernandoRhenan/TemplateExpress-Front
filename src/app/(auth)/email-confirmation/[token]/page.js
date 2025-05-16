'use client'

import style from '@/app/(auth)/email-confirmation/emailConfirmation.module.css'
import { uuidValidation } from '@/utils/validation/uuid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function EmailConfirmation({ params }) {
   const [isLoading, setIsLoading] = useState(true)
   const [message, setMessage] = useState('')

   useEffect(() => {
      async function autoSubmit() {
         try {
            const { error } = uuidValidation(params.token)
            if (error) {
               setMessage(error.details[0].message)
               return
            }
         } catch (error) {
            return toast.error('Ocorreu um erro interno. Estamos trabalhando para consertar.')
         } finally {
            setIsLoading(false)
         }
      }

      autoSubmit()
   }, [params.token])

   return (
      <div className={style.confirmationPage}>
         {isLoading && <span>Aguarde...</span>}
         {message && <span>{message}</span>}
      </div>
   )
}
