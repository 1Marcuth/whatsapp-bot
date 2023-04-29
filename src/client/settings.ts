const bot = {
    name: "Marcuth's butler",
    prefix: "/",
    description: "Bot template made by Marcuth at https://github.com/1Marcuth",
    commands: {
        optionsSeparator: ":"
    },
    reconnectEvery: 4800000,
    owers: []
}

const reactionEmojis = {
    waiting: "⌛",
    error: "❌",
    success: "✅"
}

const stickerSize = { width: 256, height: 256 }

export {
    bot,
    reactionEmojis,
    stickerSize
}