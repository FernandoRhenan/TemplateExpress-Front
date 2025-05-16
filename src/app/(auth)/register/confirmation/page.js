'use client'

import style from '@/app/(auth)/register/confirmation/confirmation.module.css'

export default function Confirmation() {
   return (
      <div className={style.confirmationPage}>
         <span className={style.message}>
            <h1>Confirme sua conta!</h1>
            <span>
               Já enviamos um email de confirmação. Nele você receberá um link para confirmar seu cadastro e
               ativar a sua conta.
            </span>
            <span>Verifique sua caixa de spam caso não tenha o encontrado.</span>
         </span>
      </div>
   )
}
