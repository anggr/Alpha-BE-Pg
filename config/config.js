require('dotenv').config()
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME
const host = process.env.DB_HOST
const port = process.env.DB_PORT
module.exports = {
  username,
  password,
  database,
  host,
  port,
}
