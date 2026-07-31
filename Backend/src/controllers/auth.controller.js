const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

async function registerUser(req, res) {
    const { username, email, password } = req.body

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (isUserAlreadyExist) {
        return res.status(409).json({
            message: `User already exist with this ${isUserAlreadyExist.username === username ? username : email} `
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username, email, password:hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" })

    res.cookie("token", token)

    return res.status(201).json({
        message: "User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

async function loginUser(req, res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { email }, { username }
        ]
    })
    if (!user) {
        return res.status(400).json({
            message: "Invalid Credentials." //* Task-2
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid Credentials."
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" })

    res.cookie("token", token)

    return res.status(201).json({
        message: "user logged in successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })



}

async function getMe(req,res){
    const user = await userModel.findById()

}

module.exports = { registerUser, loginUser, getMe }

/** Task2 Answer: Agar tum !user case mein 
 * "User not found" bolte, aur wrong password 
 * case mein "Invalid Password" bolte, toh 
 * ek attacker easily pata laga sakta hai ki: Konsa email/username 
 * system mein exist karta hai Konsa nahi karta
*/ 