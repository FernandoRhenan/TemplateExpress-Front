import Joi from 'joi'

export function templateObjectsValidation({
   x,
   y,
   maxRows,
   fontSize,
   fontFamily,
   fontBoundingBoxDescent,
   baseBoxHeight,
   bold,
   italic,
   fieldName,
   fillStyle,
}) {
   const SMALLINT = 32_768

   const schema = Joi.object({
      x: Joi.number().required().min(0).max(SMALLINT),
      y: Joi.number().required().min(0).max(SMALLINT),
      maxRows: Joi.number().required().min(1).max(30),
      fontSize: Joi.number().required().min(6).max(160),
      fontFamily: Joi.string().required().max(100),
      fontBoundingBoxDescent: Joi.number().required().min(0).max(SMALLINT),
      baseBoxHeight: Joi.number().required().min(0).max(SMALLINT),
      bold: Joi.boolean().required(),
      italic: Joi.boolean().required(),
      fieldName: Joi.string().required().max(40),
      fillStyle: Joi.string().required().length(7),
   })

   return schema.validate({
      x,
      y,
      maxRows,
      fontSize,
      fontFamily,
      fontBoundingBoxDescent,
      baseBoxHeight,
      bold,
      italic,
      fieldName,
      fillStyle,
   })
}
