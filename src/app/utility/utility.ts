export const isEmptyArray = (input: any):boolean => {
    return !!(isArray(input) ? (input.length === 0 ? true : false) : false);
}

export const isArray = (type: any):boolean => {
    return !!Array.isArray(type) ? true : false;
}