const mongoose = require("mongoose")

const blacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true, "Token is required for blackilisting."]
    }
},{timestamps:true})

const blacklistModel = mongoose.model("blacklist", blacklistSchema)

module.exports = blacklistModel