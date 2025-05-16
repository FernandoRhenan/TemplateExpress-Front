import database from '@/infra/database.cjs'
import errorResponse from '@/utils/response/errorResponse'
import successResponse from '@/utils/response/successResponse'

export async function databaseStatus() {
   let poolClient
   try {
      poolClient = await database.getPoolClient.connect()
      const databaseName = process.env.POSTGRES_DB
      const serverVersion = await poolClient.query('SHOW server_version;')
      const maxConnections = await poolClient.query('SHOW max_connections;')
      const openConnections = await poolClient.query({
         text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1',
         values: [databaseName],
      })
      const updatedAt = new Date().toISOString()

      const data = {
         updatedAt: updatedAt,
         services: {
            database: {
               version: serverVersion.rows[0].server_version,
               maxConnections: parseInt(maxConnections.rows[0].max_connections),
               openConnections: openConnections.rows[0].count,
            },
         },
      }

      return successResponse({ statusCode: 200, data: data, message: '' })
   } catch (err) {
      console.error(err)
      return errorResponse({})
   } finally {
      if (poolClient) {
         poolClient.release()
      }
   }
}
