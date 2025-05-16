import database from '@/infra/database.cjs'
import { hashPassword } from '@/utils/back/password'
import { timestampFromNow } from '@/utils/general/timestamps'
import errorResponse from '@/utils/response/errorResponse'
import successResponse from '@/utils/response/successResponse'
import { userValidation } from '@/utils/validation/registerForm'

export async function createUser({ email, password, username }) {
   let poolClient
   try {
      const validation = userValidation({ username, email, password })

      if (validation.error) {
         return errorResponse({
            message: validation.error.message,
            errorName: 'validation',
            action: 'Revise os dados!',
            statusCode: 400,
         })
      }

      poolClient = await database.getPoolClient.connect()

      const isExistentUser = await poolClient.query({
         text: `SELECT 
                CASE 
                    WHEN username = $2 THEN 'username'
                    WHEN email = $1 THEN 'email'
                END AS match_type
            FROM tb_user
            WHERE email = $1 OR username = $2
            LIMIT 1;`,
         values: [email, username],
      })

      if (isExistentUser.rowCount > 0) {
         const matchType = isExistentUser.rows[0].match_type
         if (matchType === 'username') {
            return errorResponse({
               message: 'Nome já cadastrado!',
               errorName: 'validation',
               action: 'Tente outro nome!',
               statusCode: 400,
            })
         }
         if (matchType === 'email') {
            return errorResponse({
               message: 'Sua conta foi criada!',
               errorName: 'fake',
               action: '',
               statusCode: 201,
               data: { email },
            })
         }
      }

      const timestamp = timestampFromNow(new Date())
      const hashedPassword = await hashPassword(password)

      await poolClient.query({
         text: `INSERT INTO tb_user (email, username, password, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5)`,
         values: [email, username, hashedPassword, timestamp, timestamp],
      })

      return successResponse({
         statusCode: 201,
         message: 'Sua conta foi criada!',
         data: { email },
      })
   } catch (err) {
      console.error(err)
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

export async function createEmailConfirmationToken({ email }) {
   console.log(email)
}
