export const roundDecimals = (i, places) => {
    return Math.round(i * Math.pow(10, places)) / Math.pow(10, places);
}

export const isPositiveNumber = (value) => {
    return !isNaN(value) && value > 0;
}
