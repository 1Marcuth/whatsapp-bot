import { convertWordFiles } from "convert-multiple-files"
import { exec } from "child_process"
import path from "path"

import randString from "../client/utils/random/rand-string"

async function docxToPdf(inputFilePath: string, outputDir: string): Promise<string> {
    const outputPath = await convertWordFiles(inputFilePath, "pdf", outputDir)
    return outputPath
}   

async function pdfToDocx(inputFilePath: string, outputDir: string): Promise<string> {
    const outputFileName = randString(10) + ".docx"
    const outputFilePath = path.join(outputDir, outputFileName)
    const pythonScriptFilePath = path.resolve(__dirname, "..", "helper-scripts", "pdf-to-docx.py")
    const command = `python ${pythonScriptFilePath} ${inputFilePath} ${outputFilePath}`
    
    await new Promise((resolve, reject) => {
        exec(command, (error, stout) => {
            if (error) reject(error)

            resolve(stout)
        })
    })
    
    return outputFilePath
}

export {
    docxToPdf,
    pdfToDocx
}