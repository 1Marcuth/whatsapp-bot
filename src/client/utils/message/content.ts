import { botPrefix } from "../../settings"

function extractCommandAndOptions(messageContent: string) {
    if (!messageContent) return { command: "", options: [] }

    let [ command, ...options ] = messageContent
        .toLowerCase()
        .trim()
        //.slice(botPrefix.length)
        .split(" ")

    options = options.filter(option => option.trim() !== "")

    return { command, options }
}

function formatHtmlToMarkdown(originalText: string) {
    const formaterConfig = [
        {
            markdown: "*",
            tag: {
                name: "b",
                needClose: true
            }
        },
        {
            markdown: "_",
            tag: {
                name: "i",
                needClose: true
            }
        },
        {
            markdown: "~",
            tag: {
                name: "s",
                needClose: true
            }
        },
        {
            markdown: "\n",
            tag: {
                name: "br",
                needClose: false
            }
        },
        {
            markdown: "```",
            tag: {
                name: "code",
                needClose: true
            }
        },
        {
            markdown: "*",
            tag: {
                name: "strong",
                needClose: true
            }
        },
        {
            markdown: "_",
            tag: {
                name: "em",
                needClose: true
            }
        },
        {
            markdown: "_",
            tag: {
                name: "em",
                needClose: true
            }
        },
        {
            markdown: "~",
            tag: {
                name: "del",
                needClose: true
            }
        }
    ]

    let formatedText = String(originalText)

    for (const tagToMdConfig of formaterConfig) {
        const openTag = `<${tagToMdConfig.tag.name}>`
        const closeTag = `</${tagToMdConfig.tag.name}>`

        const openTagExp = new RegExp(openTag, "gi")
        const closeTagExp = new RegExp(closeTag, "gi")

        if (originalText.includes(openTag) || originalText.includes(closeTag)) {
            formatedText = formatedText.replace(openTagExp, tagToMdConfig.markdown)

            if (tagToMdConfig.tag.needClose) {
                const matchedOpenTags = originalText.match(openTagExp)
                const matchedCloseTags = originalText.match(closeTagExp)

                if (!matchedCloseTags || !matchedOpenTags || matchedOpenTags.length !== matchedCloseTags.length) {
                    throw new SyntaxError("Possibly there are tags that have not been opened or closed")
                }

                formatedText = formatedText.replace(closeTagExp, tagToMdConfig.markdown)
            }
        }
    }

    return formatedText
}

export {
    extractCommandAndOptions,
    formatHtmlToMarkdown
}