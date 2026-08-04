const multer = require("multer")
// npm i multer: multer is Express middleware used to handle multipart/form-data, primarily for file uploads (images, videos, audio, PDFs, etc.).

const storage  = multer.memoryStorage()

const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*10 //10MB
    }
})

module.exports = upload