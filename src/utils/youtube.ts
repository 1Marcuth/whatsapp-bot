import ytdl from "ytdl-core"
import fs from "fs"

async function downloadVideoAudioFromYouTube(url: string, filePath: string) {
    console.log(`> [yt-audio-downloader] Downloading audio from url '${url}'`)

    const info = await ytdl.getInfo(url)
    const audioFormats = ytdl.filterFormats(info.formats, "audioonly")
    const audio = audioFormats[0]
    const stream = ytdl.downloadFromInfo(info, { format: audio })

    const writeStream = fs.createWriteStream(filePath)

    stream.pipe(writeStream)

    return await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve)
        writeStream.on("error", reject)
    })
}

function downloadVideoFromYouTube(url: string, filePath: string) {
    console.log(`> [yt-audio-downloader] Downloading video from url '${url}'`)

    const video = ytdl(url, { filter: "videoandaudio" })

    const writeStream = fs.createWriteStream(filePath)

    video.pipe(writeStream)

    return new Promise((resolve, reject) => {
        writeStream.on("finish", resolve)
        writeStream.on("error", reject)
    })
}

export {
    downloadVideoFromYouTube,
    downloadVideoAudioFromYouTube
}