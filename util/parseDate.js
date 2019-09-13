export default function(dateString) {
    try {
        let timeSum = 0;
        const dateSeparated = dateString.split(' ');
        if (dateSeparated.length === 2) {
            const times = dateSeparated[1].split(':');
            timeSum += parseInt(times[0]) * 3600 * 1000;
            timeSum += parseInt(times[1]) * 1000
        }
        const dateSum = Date.parse(dateSeparated[0]);
        return timeSum + dateSum;
    } catch {
        return 0;
    }
}
