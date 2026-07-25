const mongoose = require("mongoose")

async function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    console.log("Connected To mongoDB");
    
}

module.exports = connectToDB