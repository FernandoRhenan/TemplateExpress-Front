import Joi from 'joi'

export function templateValidation({ userId, width, height }) {
   const SMALLINT = 32_768

   const schema = Joi.object({
      userId: Joi.number().required().min(1).messages({
         'number.base': 'Erro de autenticação.',
         'any.required': 'Erro de autenticação.',
         'number.min': 'Erro de autenticação.',
      }),
      width: Joi.number().required().min(100).max(SMALLINT).messages({
         'number.base': 'Escolha uma imagem válida!',
         'any.required': 'Escolha uma imagem válida!',
         'number.min': 'A imagem deve ter pelo menos 100x100 de tamanho.',
         'number.max': 'A imagem excede o limite de comprimento.',
      }),
      height: Joi.number().required().min(100).max(SMALLINT).messages({
         'number.base': 'Escolha uma imagem válida!',
         'any.required': 'Escolha uma imagem válida!',
         'number.min': 'A imagem deve ter pelo menos 100x100 de tamanho.',
         'number.max': 'A imagem excede o limite de altura.',
      }),
   })

   return schema.validate({ userId, width, height })
}
