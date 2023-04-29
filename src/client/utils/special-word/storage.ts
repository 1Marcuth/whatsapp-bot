import { bot } from "../../settings"

import ISpecialWord from "../../interfaces/special-word"

class SpecialWordsStorage {
    public specialWords: ISpecialWord[] = []

    public get(name: string) {
        return this.specialWords.find(specialWord => specialWord.name === name)
    }

    public add(specialWord: ISpecialWord) {
        if (this.get(specialWord.name)) {
            throw new Error(`The special Word '${specialWord.name}' has been duplicated!`)
        }

        if (!specialWord.name || specialWord.name.includes(" ") || specialWord.name.includes(bot.commands.optionsSeparator) || specialWord.name.includes(bot.prefix)) {
            throw new Error(`The special Word '${specialWord.name}' has been duplicated!`)
        }

        if (!specialWord.run) {
            throw new Error(`The special Word '${specialWord.name}' does not have a valid runner! Runner: '${specialWord.run}'.`)
        }

        this.specialWords.push(specialWord)
    }
}

export default SpecialWordsStorage