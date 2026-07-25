//start the server
//connect to databse

const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

app.listen(3000,()=>{
    console.log("Server is running on port 3000.");   
})