import { bot } from "../../settings"

function extractCommandAndOptions(messageContent: string) {
    if (!messageContent) return { command: "", options: [] }

    let [command, ...options] = messageContent
        .slice(bot.prefix.length)
        .trim()
        .split(" ")

    command = command.toLocaleLowerCase()
    options = parseOptions(options)

    return {
        command,
        options
    }

    function parseOptions(options: string[]) {
        if (!options.join(" ").includes(bot.commands.optionsSeparator)) return [options.join(" ").trim()]

        options = options
            .join(" ")
            .split(bot.commands.optionsSeparator)
            .map(option => option.trim())
            .filter(option => option !== "")

        return options
    }
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

    for (const tagToMarkdowndConfig of formaterConfig) {
        const openTag = `<${tagToMarkdowndConfig.tag.name}>`
        const closeTag = `</${tagToMarkdowndConfig.tag.name}>`

        const openTagExpression = new RegExp(openTag, "gi")
        const closeTagExpression = new RegExp(closeTag, "gi")

        if (originalText.includes(openTag) || originalText.includes(closeTag)) {
            formatedText = formatedText.replace(openTagExpression, tagToMarkdowndConfig.markdown)

            if (tagToMarkdowndConfig.tag.needClose) {
                const matchedOpenTags = originalText.match(openTagExpression)
                const matchedCloseTags = originalText.match(closeTagExpression)

                if (!matchedCloseTags || !matchedOpenTags || matchedOpenTags.length !== matchedCloseTags.length) {
                    throw new SyntaxError("Possibly there are tags that have not been opened or closed")
                }

                formatedText = formatedText.replace(closeTagExpression, tagToMarkdowndConfig.markdown)
            }
        }
    }

    return formatedText
}

export {
    extractCommandAndOptions,
    formatHtmlToMarkdown
}