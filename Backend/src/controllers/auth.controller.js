const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

async function registerUser(req, res){
    const {username, email, password} = req.body

    const isUserAlreadyExist = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isUserAlreadyExist){
        return res.status(409).json({
            message:`User already exist with this ${isUserAlreadyExist.username === username? username : email} `
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username, email, password
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {expiresIn:"3d"})

}

async function loginUser(req, res){

}

module.exports = {registerUser, loginUser}