export const isEmptyArray = (input: any):boolean => {
    return !!(isArray(input) ? (input.length === 0 ? true : false) : false);
}

export const isArray = (type: any):boolean => {
    return !!Array.isArray(type) ? true : false;
}

export const toBoolean = (input: string | number | boolean): boolean => {
    return  input?.toString()?.toLowerCase() === 'true' || input === 1 || input === true;
}