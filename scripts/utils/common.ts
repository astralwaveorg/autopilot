/**
 * AutoPilot 
 *
 * 
 *
 * @author Astral
 * @version 1.0.0
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import moment from 'moment';

/**
 * 
 */
export function randomString(length: number = 32, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *  UUID
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 *  GUID
 */
export function guid(): string {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 *  MAC 
 */
export function randomMac(): string {
  return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, function() {
    return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
  });
}

/**
 * 
 */
export function maskPhone(phone: string): string {
  if (phone.length === 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  return phone;
}

/**
 * 
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username && domain) {
    const masked = username.substring(0, 2) + '***' + username.substring(username.length - 1);
    return `${masked}@${domain}`;
  }
  return email;
}

/**
 * 
 */
export function timestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * 
 */
export function timestampMs(): number {
  return Date.now();
}

/**
 * 
 */
export function timestampToDate(ts: number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return moment(ts * 1000).format(format);
}

/**
 * 
 */
export function dateToTimestamp(date: string, format: string = 'YYYY-MM-DD HH:mm:ss'): number {
  return moment(date, format).unix();
}

/**
 * 
 */
export function currentDate(format: string = 'YYYY-MM-DD'): string {
  return moment().format(format);
}

/**
 * 
 */
export function currentTime(format: string = 'HH:mm:ss'): string {
  return moment().format(format);
}

/**
 * 
 */
export function currentDateTime(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return moment().format(format);
}

/**
 * 
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * MD5 
 */
export function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * SHA1 
 */
export function sha1(str: string): string {
  return crypto.createHash('sha1').update(str).digest('hex');
}

/**
 * SHA256 
 */
export function sha256(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Base64 
 */
export function base64Encode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

/**
 * Base64 
 */
export function base64Decode(str: string): string {
  return Buffer.from(str, 'base64').toString('utf-8');
}

/**
 * URL 
 */
export function urlEncode(str: string): string {
  return encodeURIComponent(str);
}

/**
 * URL 
 */
export function urlDecode(str: string): string {
  return decodeURIComponent(str);
}

/**
 * JSON 
 */
export function jsonStringify(obj: any, space: number = 2): string {
  return JSON.stringify(obj, null, space);
}

/**
 * JSON 
 */
export function jsonParse(str: string, defaultValue: any = null): any {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
}

/**
 * 
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 *  JSON 
 */
export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Object) {
    const copy: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepClone(obj[key]);
      }
    }
    return copy;
  }
}

/**
 * 
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * 
 */
export function sortBy<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
}

/**
 * 
 */
export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 
 */
export function objectToArray<T>(obj: Record<string, T>): Array<{ key: string; value: T }> {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

/**
 * 
 */
export function arrayToObject<T>(arr: Array<{ key: string; value: T }>): Record<string, T> {
  return arr.reduce((result, item) => {
    result[item.key] = item.value;
    return result;
  }, {} as Record<string, T>);
}

/**
 * 
 */
export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

/**
 * 
 */
export function getFileName(filename: string): string {
  return path.basename(filename, path.extname(filename));
}

/**
 * 
 */
export function getFileDir(filepath: string): string {
  return path.dirname(filepath);
}

/**
 * 
 */
export function fileExists(filepath: string): boolean {
  return fs.existsSync(filepath);
}

/**
 * 
 */
export function readFile(filepath: string, encoding: BufferEncoding = 'utf-8'): string {
  try {
    return fs.readFileSync(filepath, encoding);
  } catch (error) {
    throw new Error(`: ${(error as Error).message}`);
  }
}

/**
 * 
 */
export function writeFile(filepath: string, content: string, encoding: BufferEncoding = 'utf-8'): void {
  try {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filepath, content, encoding);
  } catch (error) {
    throw new Error(`: ${(error as Error).message}`);
  }
}

/**
 * 
 */
export function deleteFile(filepath: string): void {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (error) {
    throw new Error(`: ${(error as Error).message}`);
  }
}

/**
 * 
 */
export function getFileSize(filepath: string): number {
  try {
    const stats = fs.statSync(filepath);
    return stats.size;
  } catch (error) {
    throw new Error(`: ${(error as Error).message}`);
  }
}

/**
 * 
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * HTTP GET 
 */
export async function httpGet<T = any>(url: string, config?: any): Promise<T> {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw new Error(`GET : ${(error as Error).message}`);
  }
}

/**
 * HTTP POST 
 */
export async function httpPost<T = any>(url: string, data?: any, config?: any): Promise<T> {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(`POST : ${(error as Error).message}`);
  }
}

/**
 * HTTP PUT 
 */
export async function httpPut<T = any>(url: string, data?: any, config?: any): Promise<T> {
  try {
    const response = await axios.put(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(`PUT : ${(error as Error).message}`);
  }
}

/**
 * HTTP DELETE 
 */
export async function httpDelete<T = any>(url: string, config?: any): Promise<T> {
  try {
    const response = await axios.delete(url, config);
    return response.data;
  } catch (error) {
    throw new Error(`DELETE : ${(error as Error).message}`);
  }
}

/**
 * 
 */
export async function getGeoByGD(address: string): Promise<any> {
  const amapKey = process.env.AMAP_KEY;
  if (!amapKey) {
    throw new Error(' API Key');
  }

  const url = `https://restapi.amap.com/v3/geocode/geo?key=${amapKey}&address=${encodeURIComponent(address)}`;
  return httpGet(url);
}

/**
 * IP 
 */
export async function getLocationByIp(ip: string = ''): Promise<any> {
  const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
  return httpGet(url);
}

/**
 * 
 */
export async function getHitokoto(): Promise<string> {
  try {
    const response = await httpGet('https://v1.hitokoto.cn/');
    return `${response.hitokoto} —— ${response.from}`;
  } catch (error) {
    return '';
  }
}

/**
 * 
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(delay * (i + 1));
      }
    }
  }

  throw lastError!;
}

/**
 * 
 */
export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(` (${ms}ms)`)), ms)
    ),
  ]);
}

/**
 * 
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

export default {
  randomString,
  randomInt,
  uuid,
  guid,
  randomMac,
  maskPhone,
  maskEmail,
  timestamp,
  timestampMs,
  timestampToDate,
  dateToTimestamp,
  currentDate,
  currentTime,
  currentDateTime,
  sleep,
  md5,
  sha1,
  sha256,
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  jsonStringify,
  jsonParse,
  isEmpty,
  isJson,
  deepClone,
  unique,
  groupBy,
  sortBy,
  randomItem,
  shuffle,
  objectToArray,
  arrayToObject,
  getFileExtension,
  getFileName,
  getFileDir,
  fileExists,
  readFile,
  writeFile,
  deleteFile,
  getFileSize,
  formatFileSize,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  getGeoByGD,
  getLocationByIp,
  getHitokoto,
  retry,
  timeout,
  debounce,
  throttle,
};