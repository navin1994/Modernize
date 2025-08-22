import * as moment from "moment";

export const isEmptyArray = (input: any): boolean => {
  return !!(isArray(input) ? (input.length === 0 ? true : false) : false);
};

export const isDate = (value: any): boolean => {
  return moment(value, moment.ISO_8601, true).isValid();
};

export const dateToNumber = (input: string): number =>
  new Date(input).getTime();

export const isArray = (type: any): boolean => {
  return !!Array.isArray(type) ? true : false;
};

export const isBoolean = (input: any): boolean => {
  const value = input?.toString()?.toLowerCase();
  return value === "true" || value === "false";
};

export const toBoolean = (input: string | number | boolean): boolean => {
  return (
    input?.toString()?.toLowerCase() === "true" || input === 1 || input === true
  );
};

export const isNumeric = (value: any): boolean => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const areObjectsEqual = (obj1: any, obj2: any): boolean => {
  // Check for strict equality for primitives
  if (obj1 === obj2) return true;

  // If one is null or types are different, not equal
  if (
    obj1 === null || obj2 === null ||
    typeof obj1 !== typeof obj2
  ) return false;

  // Arrays
  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2)) return false;
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!areObjectsEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }

  // Objects
  if (typeof obj1 === 'object') {
    if (typeof obj2 !== 'object') return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!areObjectsEqual(obj1[key], obj2[key])) return false;
    }
    return true;
  }

  // Fallback for other types (like functions, symbols)
  return false;
};

// Memoization utility for deep equality
const deepEqualMemo = new WeakMap<any, Map<any, boolean>>();

export const areObjectsSame = (obj1: any, obj2: any): boolean => {
  // Memoization: avoid recomputation for same object pairs
  if (obj1 && obj2 && typeof obj1 === 'object' && typeof obj2 === 'object') {
    let map = deepEqualMemo.get(obj1);
    if (map && map.has(obj2)) {
      return map.get(obj2)!;
    }
    const result = areObjectsEqual(obj1, obj2);
    if (!map) {
      map = new Map<any, boolean>();
      deepEqualMemo.set(obj1, map);
    }
    map.set(obj2, result);
    return result;
  }
  // Fallback for primitives
  return areObjectsEqual(obj1, obj2);
};

export const isObject = (input: any): boolean => {
  return JSON.stringify(input)?.startsWith("{");
};

export const isArrayOfObjects = (input: any): boolean => {
  return JSON.stringify(input)?.startsWith("[{");
};

export const isObjectEmpty = (input: any): boolean => Object.keys(input).length == 0; 

export const sortObjectByKeys = (obj: any) => {
  // Get all the keys from the object and sort them
  const sortedKeys = Object.keys(obj).sort();

  // Create a new object to store the sorted key-value pairs
  const sortedObj:Record<any, any> = {};

  // Iterate through sorted keys and add them to the new object
  for (const key of sortedKeys) {
    sortedObj[key] = obj[key];
  }

  return sortedObj;
}
