function contentSpecialWord(text: string, specialWords: string[]) {
    for (const specialWord of specialWords) {
        if (text.includes(specialWord)) {
            return [ true, specialWord ]
        }
    }

    return [ false, null ]
}

export {
    contentSpecialWord
}