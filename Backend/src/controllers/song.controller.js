const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")
// npm i node-id3: This installs the node-id3 package, which lets you read, write, update, and remove ID3 tags (metadata) from MP3 files.

async function uploadSong(req, res) {
    // console.log(req.file);

    const songBuffer = req.file.buffer
    const { mood } = req.body

    const tags = id3.read(songBuffer)
    const [songFile, posterFile] = await Promise.all([ //Promise.all ka sirf itna sa kaam 
        // hai ki jab tak ye dono kaam complete na ho jaye tab tak aage nahi badhenge
        storageService.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/Emotify/Songs"
        }),

        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + ".jpeg",
            folder: "/Emotify/Posters"
        })
    ])

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        postUrl: posterFile.url,
        mood
    })

    return res.status(201).json({
        message: "Song uploaded successfully",
        song
    })
}


async function getSong(req, res) {
    const { mood } = req.query

    if (!mood) {
        return res.status(400).json({
            message: "Mood query param is required."
        })
    }

    // case-insensitive match — works whether the DB has "sad", "Sad", or "SAD"
    const songs = await songModel.aggregate([
        { $match: { mood: { $regex: new RegExp(`^${mood}$`, "i") } } },
        { $sample: { size: 1 } }
    ])

    if (songs.length === 0) {
        return res.status(404).json({
            message: `No songs found for mood: ${mood}`
        })
    }

    return res.status(200).json({
        message: "Song fetched successfully",
        song: songs[0]
    })
}

module.exports = { uploadSong, getSong }