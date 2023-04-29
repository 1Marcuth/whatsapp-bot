import path from "path"
import fs from "fs"

import SpecialWordsStorage from "../utils/special-word/storage"

import ISpecialWord from "../interfaces/special-word/index"

export default async (specialWordsStorage: SpecialWordsStorage) => {
    const specialWordsDirPath = path.join(__dirname, "../special-words")
    const fileExtension = path.extname(__filename)

    fs.readdirSync(specialWordsDirPath)
        .forEach(dir => {
            const subFolder = path.join(specialWordsDirPath, dir)
            fs.readdirSync(subFolder)
                .filter(file => file.endsWith(fileExtension))
                .forEach(async (file) => {
                    const specialWordFilePath = path.join(subFolder, file)
                    const specialWord = await importSpecialWord(specialWordFilePath)

                    if (!specialWord.name) {
                        throw new Error(`> [client-special-words-handler-error] Not valid special word name on: ${specialWordFilePath}.`)
                    }

                    if (!specialWord.run) {
                        throw new Error(`> [client-special-words-handler-error] Not validspecial word run on: ${specialWordFilePath}.`)
                    }

                    loadSpecialWord(specialWord)

                    function loadSpecialWord(specialWord: ISpecialWord) {
                        specialWordsStorage.add(specialWord)

                        console.log(`> [client] Special word '${specialWord.name}' loaded.`)
                    }
                })
        })

    async function importSpecialWord(commandFilePath: string) {
        const command: ISpecialWord = (await import(commandFilePath)).specialWord
        return command
    }
}