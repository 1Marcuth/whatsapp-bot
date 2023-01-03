enum MessageParseModes {
    markdown,
    html
}

type IMessageParseModes = keyof typeof MessageParseModes

export default IMessageParseModes