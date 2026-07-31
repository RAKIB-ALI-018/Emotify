//server creation

require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")


const app = express()
app.use(express.json())

module.exports = app