export const isEmptyArray = (input: any):boolean => {
    return !!(isArray(input) ? (input.length === 0 ? true : false) : false);
}

export const isArray = (type: any):boolean => {
    return !!Array.isArray(type) ? true : false;
}

export const isBoolean = (input: any): boolean => {
    const value = input?.toString()?.toLowerCase();
    return value === 'true' || value === 'false';
}

export const toBoolean = (input: string | number | boolean): boolean => {
    return  input?.toString()?.toLowerCase() === 'true' || input === 1 || input === true;
}

export const isNumeric = (value: any): boolean => {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

export const areObjectsEqual = (obj1: { [x: string]: any; } | null, obj2: { [x: string]: any; } | null): boolean => {
    // Check if both parameters are objects and not null
    if (obj1 === obj2) return true; // Reference equality
    if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
    
    // Get the property keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    // Check if the number of properties is different
    if (keys1.length !== keys2.length) return false;
    
    // Check each property and value recursively
    for (let key of keys1) {
        if (!keys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    
    return true; // All checks passed
}

export const areObjectsSame = (obj1: any, obj2: any): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export const isObject = (input: any): boolean => {
    return JSON.stringify(input)?.includes('{');
}