import { tlds } from './tdlList.js'
import Joi from 'joi'

export function userValidation({ username, email, password }) {
   const schema = Joi.object({
      username: Joi.string()
         .required()
         .pattern(/^[A-Za-z0-9_-]+$/)
         .min(3)
         .max(40)
         .messages({
            'string.empty': 'Preencha o campo nome.',
            'string.pattern.base': 'O nome pode conter apenas letras, números, hífen e sublinhado.',
            'string.min': 'O nome deve ter pelo menos 3 caracteres.',
            'string.max': 'O nome não pode ser maior que 40 carcateres.',
         }),

      email: Joi.string()
         .required()
         .email({ allowFullyQualified: false, tlds: { allow: tlds } })
         .min(8)
         .max(253)
         .messages({
            'string.empty': 'Preencha o campo e-mail.',
            'string.email': 'E-mail mal formatado.',
            'string.min': 'O e-mail deve ter pelo menos 8 caracteres.',
            'string.max': 'O e-mail não pode ser maior que 253 carcateres.',
         }),

      password: Joi.string().required().min(8).max(80).messages({
         'string.empty': 'Preencha o campo senha.',
         'string.min': 'A senha deve ter pelo menos 8 caracteres.',
         'string.max': 'A senha não pode ser maior que 80 carcateres.',
      }),
   })

   return schema.validate({ username, email, password })
}
