import * as moment from "moment";

export const isEmptyArray = (input: any): boolean => {
  return !!(isArray(input) ? (input.length === 0 ? true : false) : false);
};

export const isDate = (value: any): boolean => {
  if (!value) return false;
  
  // Handle Date objects
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  
  // Handle strings and numbers
  if (typeof value === 'string' || typeof value === 'number') {
    // First try moment's intelligent parsing
    const momentDate = moment(value);
    if (momentDate.isValid()) {
      // Additional validation: make sure it's not parsing random strings as dates
      const year = momentDate.year();
      // Reasonable year range (1900-2100)
      if (year >= 1900 && year <= 2100) {
        return true;
      }
    }
    
    // If string, try common date patterns with strict parsing
    if (typeof value === 'string') {
      const commonFormats = [
        'YYYY-MM-DD',           // 2025-08-20
        'DD/MM/YYYY',           // 20/08/2025
        'MM/DD/YYYY',           // 08/20/2025
        'DD-MM-YYYY',           // 20-08-2025
        'YYYY/MM/DD',           // 2025/08/20
        'MMMM Do, YYYY',        // August 4th, 2025
        'MMMM D, YYYY',         // August 4, 2025
        'MMM DD, YYYY',         // Aug 20, 2025
        'DD MMM YYYY',          // 20 Aug 2025
        'DD-MMM-YYYY',          // 20-Aug-2025
        'YYYY-MM-DD HH:mm:ss',  // 2025-08-20 14:30:00
        'DD/MM/YYYY HH:mm',     // 20/08/2025 14:30
        'MM-DD-YYYY',           // 08-20-2025
        'YYYY.MM.DD',           // 2025.08.20
        'DD.MM.YYYY',           // 20.08.2025
        moment.ISO_8601         // ISO format
      ];
      
      for (const format of commonFormats) {
        const strictParsed = moment(value, format, true);
        if (strictParsed.isValid()) {
          const year = strictParsed.year();
          if (year >= 1900 && year <= 2100) {
            return true;
          }
        }
      }
    }
    
    // If numeric, check if it could be a timestamp
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      const num = Number(value);
      // Check for Unix timestamp (seconds since 1970) - convert to milliseconds
      if (num > 0 && num < 2147483647) { // Max 32-bit timestamp in seconds
        const date = moment.unix(num);
        if (date.isValid() && date.year() >= 1970 && date.year() <= 2100) {
          return true;
        }
      }
      // Check for JavaScript timestamp (milliseconds since 1970)
      if (num > 0 && num < 4102444800000) { // Year 2100 in milliseconds
        const date = moment(num);
        if (date.isValid() && date.year() >= 1970 && date.year() <= 2100) {
          return true;
        }
      }
    }
  }
  
  return false;
};

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
