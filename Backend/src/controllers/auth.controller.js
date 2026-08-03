const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const blacklistModel = require("../models/blacklist.model")
const redis = require("../config/cache")

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
        username, email, password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" })

    res.cookie("token", token)

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

async function loginUser(req, res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { email }, { username }
        ]
    }).select("+password")

    if (!user) {
        return res.status(400).json({
            // message: "Invalid Credentials." //* Task-2
            message:"No account found with this email/username."
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            // message: "Invalid Credentials."
            message:"Incorrect Password."
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

async function getMe(req, res) {
    const user = await userModel.findById(req.user.id)
    //select("-password") : isse password read nahi hoga...security purpose ke liye use kiya jata hai

    return res.status(200).json({
        message: "User fetched successfully",
        user
    })

    //mistake i did: app.use(cookieParser()) isse add nahi kiya tha 

}

async function logoutUser(req, res){
    const token = req.cookies.token

    res.clearCookie("token")

    // await blacklistModel.create({
    //     token
    // })

    redis.set(token, Date.now().toString(), "EX", 60*60)

    res.status(200).json({
        message:"Logout successfully."
    })


}

module.exports = { registerUser, loginUser, getMe, logoutUser }

/** Task2 Answer: Agar tum !user case mein 
 * "User not found" bolte, aur wrong password 
 * case mein "Invalid Password" bolte, toh 
 * ek attacker easily pata laga sakta hai ki: Konsa email/username 
 * system mein exist karta hai Konsa nahi karta
*/ 