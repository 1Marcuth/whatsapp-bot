import path from "path"
import { Rembg } from "rembg-node"
import sharp from "sharp"
import randString from "../client/utils/random/rand-string"

async function removeBackground(inputFilePath: string, outputDir: string) {
    sharp.cache(false)

    const outputFileName = randString(10) + ".png"
    const outputFilePath = path.join(outputDir, outputFileName)

    const inputImage = sharp(inputFilePath)
	const rembg = new Rembg({ logging: true })

	const output = await rembg.remove(inputImage)

	await output.toFile(outputFilePath)

	return outputFilePath
}

export {
    removeBackground
}