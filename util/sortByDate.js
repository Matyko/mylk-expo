import parseDate from "./parseDate";

export default function (a, b) {
    const aTime = parseDate(a.date);
    const bTime = parseDate(b.date);

    return aTime > bTime ? 1 : aTime < bTime ? -1 : 0
}
