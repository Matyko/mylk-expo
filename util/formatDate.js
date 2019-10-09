const constants = {
    TODAY: 'Today',
    TOMORROW: 'Tomorrow',
    DATETIME: 'datetime',
    DATE: 'date',
    TIME: 'time',
    ALL_DAY: 'All day',
    MORNING: 'Morning',
    AFTERNOON: 'Afternoon',
    EVENING: 'Evening',
    NIGHT: 'Night',
    CUSTOM: 'Custom'
};

export default function getHumanizedData(date) {
    const DATE = new Date(+date);
    const humanizedDate = getHumanizedDate(DATE);
    const humanizedTime = getHumanizedTime(DATE);
    return humanizedDate + " " + humanizedTime;
}

export function getHumanizedDate(date) {
    if (isToday(date)) {
        return constants.TODAY
    } else if (isTomorrow(date)) {
        return constants.TOMORROW
    } else {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    }
}

export function getHumanizedTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (+minutes === 0) {
        switch (hours) {
            case 0:
                return constants.ALL_DAY;
            case 9:
                return constants.MORNING;
            case 12:
                return constants.AFTERNOON;
            case 18:
                return constants.EVENING;
            case 21:
                return constants.NIGHT;
            default:
                return `${hours.toString().length === 1 ? '0' + hours : hours}` + ":" + `${minutes.toString().length === 1 ? '0' + minutes : minutes}`;
        }
    }
    return `${hours.toString().length === 1 ? '0' + hours : hours}` + ":" + `${minutes.toString().length === 1 ? '0' + minutes : minutes}`
}

function isToday(date) {
    const today = new Date();
    return compareDates(today, date)
}

function isTomorrow(date) {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return compareDates(tomorrow, date)
}

function compareDates(date1, date2) {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
}
