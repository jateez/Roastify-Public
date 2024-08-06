if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const cors = require("cors")
const { router } = require('./routes')
const port = process.env.PORT || 3003

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use("/", router)


app.listen(port, () => {
  console.log(`Roastify server is listening on PORT ${port}`)
})