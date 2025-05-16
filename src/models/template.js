import fs from 'node:fs'
import { join } from 'node:path'
import database from '@/infra/database.cjs'
import { timestampFromNow } from '@/utils/general/timestamps'
import errorResponse from '@/utils/response/errorResponse'
import successResponse from '@/utils/response/successResponse'
import { templateValidation } from '@/utils/validation/template'
import { templateObjectsValidation } from '@/utils/validation/templateObjects'

export async function createTemplate(data) {
   let poolClient

   try {
      if (!data.image || !data.image.name) {
         return errorResponse({
            action: 'Tente novamente, caso o erro persista, por favor reporte-o ao suporte.',
            errorName: 'validation',
            message: 'Imagem inválida.',
            statusCode: 400,
         })
      }

      const resTemplateValidation = templateValidation({
         userId: data.userId,
         width: data.width,
         height: data.height,
      })
      if (resTemplateValidation.error) {
         return errorResponse({
            action: 'Tente novamente, caso o erro persista, por favor reporte-o ao suporte.',
            errorName: 'validation',
            message: resTemplateValidation.error.message,
            statusCode: 400,
         })
      }

      for (let i = 0; i < data.pointsStack.length; i++) {
         const resTemplateObjectValidation = templateObjectsValidation(data.pointsStack[i])
         if (resTemplateObjectValidation.error) {
            return errorResponse({
               action: 'Revise a configuração dos pontos marcados no template.',
               errorName: 'validation',
               message: 'Pontos inválidos!',
               statusCode: 400,
            })
         }
      }

      poolClient = await database.getPoolClient.connect()

      const timestamp = timestampFromNow(new Date())

      await poolClient.query('BEGIN')

      const template = await poolClient.query({
         text: `INSERT INTO tb_template (userId, width, height, updatedAt, createdAt) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
         values: [data.userId, data.width, data.height, timestamp, timestamp],
      })

      await setImageLocally(data.image, template.rows[0].id)

      const values = []
      const placeholders = []
      let counter = 1

      for (let point of data.pointsStack) {
         placeholders.push(
            `($${counter}, $${counter + 1}, $${counter + 2}, $${counter + 3}, $${counter + 4}, $${counter + 5}, $${counter + 6}, $${counter + 7}, $${counter + 8}, $${counter + 9}, $${counter + 10}, $${counter + 11}, $${counter + 12}, $${counter + 13})`
         )
         values.push(
            template.rows[0].id,
            point.fieldName,
            point.italic,
            point.bold,
            point.fontSize,
            point.fontFamily,
            point.fillStyle,
            point.x,
            point.y,
            point.baseBoxHeight,
            point.fontBoundingBoxDescent,
            point.maxRows,
            timestamp,
            timestamp
         )
         counter += 14
      }

      const query = `INSERT INTO tb_template_object
                  (templateId, fieldName, italic, bold, fontSize, fontFamily, fillStyle, x, y, baseBoxHeight, fontBoundingBoxDescent, maxRows, updatedAt, createdAt)
                  VALUES ${placeholders.join(', ')}`

      await poolClient.query({
         text: query,
         values: values,
      })

      await poolClient.query('COMMIT')

      return successResponse({
         message: 'Template criado com sucesso!',
         statusCode: 201,
      })
   } catch (err) {
      console.error(err)
      await poolClient.query('ROLLBACK')
      return errorResponse({})
   } finally {
      // This is to tests w mocks don't crash.
      // if validation don't be true, poolClient is undefined
      // else, it turns a pool client
      if (poolClient) {
         poolClient.release()
      }
   }
}

export async function setImageLocally(image, imageId) {
   const uploadDir = join(process.cwd(), 'src', 'local_image_storage')
   const filePath = join(uploadDir, `${imageId}_${image.name}`)

   const buffer = Buffer.from(await image.arrayBuffer())

   fs.writeFile(filePath, buffer, (err) => {
      if (err) throw Error()
      return
   })
}

export async function getImageLocally() {}
