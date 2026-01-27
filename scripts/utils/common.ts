/**
 * AutoPilot 通用工具函数库
 *
 * 提供各种常用的工具函数
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
 * 生成随机字符串
 */
export function randomString(length: number = 32, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 生成随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成 UUID
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 生成 GUID
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
 * 生成随机 MAC 地址
 */
export function randomMac(): string {
  return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, function() {
    return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
  });
}

/**
 * 手机号脱敏
 */
export function maskPhone(phone: string): string {
  if (phone.length === 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  return phone;
}

/**
 * 邮箱脱敏
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
 * 获取当前时间戳（秒）
 */
export function timestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * 获取当前时间戳（毫秒）
 */
export function timestampMs(): number {
  return Date.now();
}

/**
 * 时间戳转日期
 */
export function timestampToDate(ts: number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return moment(ts * 1000).format(format);
}

/**
 * 日期转时间戳
 */
export function dateToTimestamp(date: string, format: string = 'YYYY-MM-DD HH:mm:ss'): number {
  return moment(date, format).unix();
}

/**
 * 获取当前日期
 */
export function currentDate(format: string = 'YYYY-MM-DD'): string {
  return moment().format(format);
}

/**
 * 获取当前时间
 */
export function currentTime(format: string = 'HH:mm:ss'): string {
  return moment().format(format);
}

/**
 * 获取当前日期时间
 */
export function currentDateTime(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return moment().format(format);
}

/**
 * 延迟执行
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * MD5 加密
 */
export function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * SHA1 加密
 */
export function sha1(str: string): string {
  return crypto.createHash('sha1').update(str).digest('hex');
}

/**
 * SHA256 加密
 */
export function sha256(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Base64 编码
 */
export function base64Encode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

/**
 * Base64 解码
 */
export function base64Decode(str: string): string {
  return Buffer.from(str, 'base64').toString('utf-8');
}

/**
 * URL 编码
 */
export function urlEncode(str: string): string {
  return encodeURIComponent(str);
}

/**
 * URL 解码
 */
export function urlDecode(str: string): string {
  return decodeURIComponent(str);
}

/**
 * JSON 字符串化（支持中文）
 */
export function jsonStringify(obj: any, space: number = 2): string {
  return JSON.stringify(obj, null, space);
}

/**
 * JSON 解析（支持错误处理）
 */
export function jsonParse(str: string, defaultValue: any = null): any {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
}

/**
 * 判断是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 判断是否为有效的 JSON 字符串
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
 * 深度克隆
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
 * 数组去重
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 数组分组
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
 * 数组排序
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
 * 获取随机元素
 */
export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 数组乱序
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
 * 对象键值对转数组
 */
export function objectToArray<T>(obj: Record<string, T>): Array<{ key: string; value: T }> {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

/**
 * 数组转对象
 */
export function arrayToObject<T>(arr: Array<{ key: string; value: T }>): Record<string, T> {
  return arr.reduce((result, item) => {
    result[item.key] = item.value;
    return result;
  }, {} as Record<string, T>);
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

/**
 * 获取文件名（不含扩展名）
 */
export function getFileName(filename: string): string {
  return path.basename(filename, path.extname(filename));
}

/**
 * 获取文件所在目录
 */
export function getFileDir(filepath: string): string {
  return path.dirname(filepath);
}

/**
 * 检查文件是否存在
 */
export function fileExists(filepath: string): boolean {
  return fs.existsSync(filepath);
}

/**
 * 读取文件
 */
export function readFile(filepath: string, encoding: BufferEncoding = 'utf-8'): string {
  try {
    return fs.readFileSync(filepath, encoding);
  } catch (error) {
    throw new Error(`读取文件失败: ${(error as Error).message}`);
  }
}

/**
 * 写入文件
 */
export function writeFile(filepath: string, content: string, encoding: BufferEncoding = 'utf-8'): void {
  try {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filepath, content, encoding);
  } catch (error) {
    throw new Error(`写入文件失败: ${(error as Error).message}`);
  }
}

/**
 * 删除文件
 */
export function deleteFile(filepath: string): void {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (error) {
    throw new Error(`删除文件失败: ${(error as Error).message}`);
  }
}

/**
 * 获取文件大小
 */
export function getFileSize(filepath: string): number {
  try {
    const stats = fs.statSync(filepath);
    return stats.size;
  } catch (error) {
    throw new Error(`获取文件大小失败: ${(error as Error).message}`);
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * HTTP GET 请求
 */
export async function httpGet<T = any>(url: string, config?: any): Promise<T> {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw new Error(`GET 请求失败: ${(error as Error).message}`);
  }
}

/**
 * HTTP POST 请求
 */
export async function httpPost<T = any>(url: string, data?: any, config?: any): Promise<T> {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(`POST 请求失败: ${(error as Error).message}`);
  }
}

/**
 * HTTP PUT 请求
 */
export async function httpPut<T = any>(url: string, data?: any, config?: any): Promise<T> {
  try {
    const response = await axios.put(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(`PUT 请求失败: ${(error as Error).message}`);
  }
}

/**
 * HTTP DELETE 请求
 */
export async function httpDelete<T = any>(url: string, config?: any): Promise<T> {
  try {
    const response = await axios.delete(url, config);
    return response.data;
  } catch (error) {
    throw new Error(`DELETE 请求失败: ${(error as Error).message}`);
  }
}

/**
 * 高德地图地理编码
 */
export async function getGeoByGD(address: string): Promise<any> {
  const amapKey = process.env.AMAP_KEY;
  if (!amapKey) {
    throw new Error('未配置高德地图 API Key');
  }

  const url = `https://restapi.amap.com/v3/geocode/geo?key=${amapKey}&address=${encodeURIComponent(address)}`;
  return httpGet(url);
}

/**
 * IP 定位
 */
export async function getLocationByIp(ip: string = ''): Promise<any> {
  const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
  return httpGet(url);
}

/**
 * 获取一言（随机句子）
 */
export async function getHitokoto(): Promise<string> {
  try {
    const response = await httpGet('https://v1.hitokoto.cn/');
    return `${response.hitokoto} —— ${response.from}`;
  } catch (error) {
    return '生活不止眼前的苟且，还有诗和远方。';
  }
}

/**
 * 重试机制
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
 * 超时控制
 */
export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`操作超时 (${ms}ms)`)), ms)
    ),
  ]);
}

/**
 * 防抖
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
 * 节流
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