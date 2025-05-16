import database from '@/infra/database.cjs'
import { timestampFromNow } from '@/utils/general/timestamps'

export async function createUserSeed() {
   const timestamp = timestampFromNow(new Date())

   await database.query({
      text: `INSERT INTO tb_user (email, username, password, createdAt, updatedAt, confirmedAccount) VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [process.env.TEST_USER_EMAIL, 'test', '123123123', timestamp, timestamp, false],
   })
}
