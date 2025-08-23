import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { isDate } from '../utility/utility';
import { DEFAULT_DATE_FORMAT } from '../models/constants';

/**
 * Centralized date utility service for consistent date handling across the application
 * Provides parsing, formatting, validation, and conversion utilities
 */
@Injectable({ providedIn: 'root' })
export class DateUtilityService {
  
  /**
   * Common date formats used throughout the application
   * Centralized to ensure consistency
   */
  private readonly COMMON_DATE_FORMATS = [
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

  /**
   * Valid year range for date validation
   */
  private readonly MIN_YEAR = 1900;
  private readonly MAX_YEAR = 2100;

  /**
   * Parse any date format to a Date object
   * Handles Date objects, strings, numbers, and objects with text property
   * @param value - Date value in any format
   * @returns Date object or null if parsing fails
   */
  parseAnyDateFormat(value: any): Date | null {
    if (!value) return null;
    
    // If it's already a Date object, validate and return
    if (value instanceof Date) {
      return !isNaN(value.getTime()) ? value : null;
    }
    
    // If it's an object with a text property (common format from form errors)
    if (this.isDateTextObject(value)) {
      return this.parseStringToDate(value.text);
    }
    
    // Use the utility's isDate function for consistent detection
    if (isDate(value)) {
      return this.parseValidatedValue(value);
    }
    
    return null;
  }

  /**
   * Parse date string using multiple formats with moment.js
   * @param dateString - Date string to parse
   * @returns Date object or null if parsing fails
   */
  parseStringToDate(dateString: string): Date | null {
    if (!dateString || dateString.trim() === '') return null;
    
    // Try strict parsing with each format
    for (const format of this.COMMON_DATE_FORMATS) {
      const parsed = moment(dateString, format, true);
      if (parsed.isValid() && this.isYearInValidRange(parsed.year())) {
        return parsed.toDate();
      }
    }
    
    // Try lenient parsing with year validation
    const lenientParsed = moment(dateString);
    if (lenientParsed.isValid() && this.isYearInValidRange(lenientParsed.year())) {
      return lenientParsed.toDate();
    }
    
    return null;
  }

  /**
   * Convert any date value to timestamp for comparison operations
   * @param value - Date value in any format
   * @returns Timestamp number or original value if not a date
   */
  convertDateToTimestamp(value: any): number | any {
    if (!value) return value;

    // Handle Date objects
    if (value instanceof Date) {
      return !isNaN(value.getTime()) ? value.getTime() : value;
    }

    // Handle moment objects
    if (this.isMomentObject(value)) {
      return value.valueOf();
    }

    // Use isDate for consistent detection, then parse
    if (isDate(value)) {
      const parsedDate = this.parseAnyDateFormat(value);
      return parsedDate ? parsedDate.getTime() : value;
    }

    return value;
  }

  /**
   * Format date using specified format or default
   * @param date - Date to format
   * @param format - Format string (defaults to DEFAULT_DATE_FORMAT)
   * @returns Formatted date string
   */
  formatDate(date: Date | string | number, format: string = DEFAULT_DATE_FORMAT): string {
    const parsedDate = this.parseAnyDateFormat(date);
    if (!parsedDate) return '';
    
    return moment(parsedDate).format(format);
  }

  /**
   * Parse date using expected format with fallback to common formats
   * Used by date directive for consistent formatting
   * @param value - Raw date value
   * @param expectedFormat - Expected format string
   * @returns Moment object or null
   */
  parseWithFallback(value: any, expectedFormat: string): moment.Moment | null {
    if (!value) return null;

    // Try expected format first
    let parsed = moment(value, expectedFormat, true);
    if (parsed.isValid() && this.isYearInValidRange(parsed.year())) {
      return parsed;
    }

    // Try intelligent parsing
    parsed = moment(value);
    if (parsed.isValid() && this.isYearInValidRange(parsed.year())) {
      return parsed;
    }

    // Try common formats
    for (const format of this.COMMON_DATE_FORMATS) {
      parsed = moment(value, format, true);
      if (parsed.isValid() && this.isYearInValidRange(parsed.year())) {
        return parsed;
      }
    }

    return null;
  }

  /**
   * Validate if a value is a date and within acceptable range
   * @param value - Value to validate
   * @returns True if valid date
   */
  isValidDate(value: any): boolean {
    if (!isDate(value)) return false;
    
    const parsed = this.parseAnyDateFormat(value);
    return parsed !== null;
  }

  /**
   * Get the common date formats array
   * @returns Array of supported date formats
   */
  getCommonFormats(): (string | moment.MomentBuiltinFormat)[] {
    return [...this.COMMON_DATE_FORMATS];
  }

  /**
   * Compare two date values for validation operations
   * @param currentValue - Current date value
   * @param conditionValue - Condition date value
   * @returns Object with converted timestamp values
   */
  prepareDateComparison(currentValue: any, conditionValue: any): { currVal: any; condVal: any } {
    return {
      currVal: this.convertDateToTimestamp(currentValue),
      condVal: this.convertDateToTimestamp(conditionValue)
    };
  }

  // Private helper methods
  private parseValidatedValue(value: any): Date | null {
    // Try intelligent parsing first
    const parsed = moment(value);
    if (parsed.isValid() && this.isYearInValidRange(parsed.year())) {
      return parsed.toDate();
    }
    
    // For strings, try detailed parsing
    if (typeof value === 'string') {
      return this.parseStringToDate(value);
    }
    
    // Handle timestamps
    if (typeof value === 'number') {
      return this.parseTimestamp(value);
    }
    
    return null;
  }

  private parseTimestamp(timestamp: number): Date | null {
    // Unix timestamp in seconds
    if (timestamp > 0 && timestamp < 2147483647) {
      const date = moment.unix(timestamp);
      return date.isValid() && this.isYearInValidRange(date.year()) ? date.toDate() : null;
    }
    
    // JavaScript timestamp in milliseconds
    if (timestamp > 0 && timestamp < 4102444800000) {
      const date = new Date(timestamp);
      return !isNaN(date.getTime()) ? date : null;
    }
    
    return null;
  }

  private isDateTextObject(value: any): boolean {
    return value && 
           typeof value === 'object' && 
           'text' in value && 
           typeof value.text === 'string';
  }

  private isMomentObject(value: any): boolean {
    return value && 
           typeof value === 'object' && 
           typeof value.valueOf === 'function' && 
           typeof value.format === 'function';
  }

  private isYearInValidRange(year: number): boolean {
    return year >= this.MIN_YEAR && year <= this.MAX_YEAR;
  }
}
