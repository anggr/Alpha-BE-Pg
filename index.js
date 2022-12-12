const express = require('express')
const cors = require('cors')
const router = require('./routes')
const passport = require('./lib/passport')
const app = express()
const db = require('./models/index')

const port = process.env.PORT || 4000

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
db.sequelize.sync()
app.use(passport.initialize())
app.use('/api', router)

app.listen(port, () => {
  console.log(`this app listening at http://localhost:${port}/api`)
})
