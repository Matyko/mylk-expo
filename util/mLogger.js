export default function Logger(message) {
    const caller = Logger.caller;
    console.debug(`${new Date().toDateString()} | function: ${caller} | message: ${message}`)
}
