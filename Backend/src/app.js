//server creation

const express = require("express")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()
app.use(express.json())

module.exports = app