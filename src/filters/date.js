
export const toTimestamp (month, year) {
    let date =month + '-' + '10-' + year
    return new Date(date)
}