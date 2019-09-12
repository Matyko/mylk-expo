export default function(date) {
    try {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    } catch {
        return 'N/A'
    }
}
