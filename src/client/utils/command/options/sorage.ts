import IValidateResult from "bot-command-options-parser/dist/interfaces/validate-result"

class CommandOptionsStorage {
    private options: IValidateResult[]

    constructor(options: IValidateResult[]) {
        this.options = options
    }

    public get(optionName: string) {
        return this.options.find(option => option.name === optionName)
    }

    public getRawValue(optionName: string) {
        for (const option of this.options)  {
            if (option.name === optionName) {
                return option.values.raw
            }
        }
    }

    public getParsedValue(optionName: string) {
        for (const option of this.options)  {
            if (option.name === optionName) {
                return option.values.parsed
            }
        }
    }

    public getType(optionName: string) {
        for (const option of this.options)  {
            if (option.name === optionName) {
                return option.type
            }
        }
    }
}

export default CommandOptionsStorage