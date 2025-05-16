const { Client, Pool } = require('pg')

async function query(queryObject) {
   let client
   try {
      client = await getNewClient()
      const result = await client.query(queryObject)
      return result
   } catch (error) {
      console.log(error)
      throw error
   } finally {
      await client.end()
   }
}

async function getNewClient() {
   const client = new Client({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      ssl: getSLL(),
   })

   await client.connect()

   return client
}

const getPoolClient = new Pool({
   host: process.env.POSTGRES_HOST,
   port: process.env.POSTGRES_PORT,
   user: process.env.POSTGRES_USER,
   database: process.env.POSTGRES_DB,
   password: process.env.POSTGRES_PASSWORD,
   ssl: getSLL(),
   allowExitOnIdle: process.env.NODE_ENV === 'production' ? false : true,
   max: process.env.NODE_ENV === 'production' ? 15 : 1,
   keepAlive: process.env.NODE_ENV === 'production' ? true : false,
})

async function closePool() {
   await getPoolClient.end()
}

function getSLL() {
   if (process.env.POSTGRES_CA && process.env.NODE_ENV === 'production') {
      return {
         ca: process.env.POSTGRES_CA,
      }
   }
   return process.env.NODE_ENV === 'production' ? true : false
}

const database = { query, getPoolClient, closePool }

module.exports = database
