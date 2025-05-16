import Joi from 'joi'

export function uuidValidation(uuid) {
   const schema = Joi.string()
      .pattern(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/)
      .messages({
         'string.pattern.base': 'Token inválido.',
      })

   return schema.validate(uuid)
}
