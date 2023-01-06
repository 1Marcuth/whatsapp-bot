import fs from "fs"

function read(filePath: string) {
    const dataString = fs.readFileSync(filePath, { encoding: "utf-8" })
    const data = JSON.parse(dataString)
    return data
}

function write(filePath: string, data: any) {
    const dataString = JSON.stringify(data)
    fs.writeFileSync(filePath, dataString)
}

export default { read, write }