/**
 * AutoPilot
 *
 * @author Astral
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';

export interface EnvOptions {
  sep?: string[];
  notifyType?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export class Env {
  public index = 0;
  public req: AxiosInstance;
  public hasError = false;
  public msgs: string[] = [];
  public logs: string[] = [];
  public startTime: number;
  public options: EnvOptions;

  constructor(
    public name: string,
    options: EnvOptions = {}
  ) {
    this.startTime = Date.now();
    this.options = {
      sep: ['&', '\n', '@'],
      notifyType: Number(process.env.NOTIFY_TYPE) || 1,
      logLevel: (process.env.LOG_LEVEL as any) || 'info',
      ...options,
    };

    this.req = axios.create({
      timeout: Number(process.env.REQUEST_TIMEOUT) * 1000 || 30000,
      headers: {
        'User-Agent': process.env.USER_AGENT || 'AutoPilot/1.0',
      },
    });

    if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
      this.req.defaults.proxy = {
        host: process.env.HTTP_PROXY_HOST || '127.0.0.1',
        port: Number(process.env.HTTP_PROXY_PORT) || 7890,
      };
    }

    this.log(` ${this.name} `, 'info');
  }

  /**
   *
   */
  async init(TaskClass: any, envName: string): Promise<void> {
    try {
      const envValue = process.env[envName];

      if (!envValue) {
        this.log(`   ${envName}`, 'warn');
        this.msgs.push(`   ${envName}`);
        await this.done();
        return;
      }

      const users = this.parse(envValue, this.options.sep!);

      if (users.length === 0) {
        this.log(`   ${envName} `, 'warn');
        this.msgs.push(`   ${envName} `);
        await this.done();
        return;
      }

      this.log(`  ${users.length} `, 'info');

      for (const [idx, userConfig] of Object.entries(users)) {
        this.index = Number(idx);
        const task = new TaskClass(userConfig, this.index);
        await task.start();
      }

      await this.done();
    } catch (error) {
      this.log(` : ${(error as Error).message}`, 'error');
      this.hasError = true;
      await this.done();
    }
  }

  /**
   *
   */
  private parse(envValue: string, seps: string[]): Record<string, string> {
    let sep = seps[0];

    for (const s of seps) {
      if (envValue.includes(s)) {
        sep = s;
        break;
      }
    }

    const users: Record<string, string> = {};
    const parts = envValue.split(sep);

    parts.forEach((part, idx) => {
      if (part.trim()) {
        users[idx] = part.trim();
      }
    });

    return users;
  }

  /**
   *
   */
  log(msg: string, level: 'debug' | 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const logMsg = `[${timestamp}] [${level.toUpperCase()}] ${msg}`;

    if (this.shouldLog(level)) {
      switch (level) {
        case 'debug':
          console.log(`\x1b[36m${logMsg}\x1b[0m`);
          break;
        case 'info':
          console.log(`\x1b[32m${logMsg}\x1b[0m`);
          break;
        case 'warn':
          console.log(`\x1b[33m${logMsg}\x1b[0m`);
          break;
        case 'error':
          console.log(`\x1b[31m${logMsg}\x1b[0m`);
          break;
      }
    }

    this.logs.push(logMsg);

    if (level === 'error') {
      this.hasError = true;
    }

    if (level !== 'debug') {
      this.msgs.push(msg);
    }
  }

  /**
   *
   */
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevel = levels.indexOf(this.options.logLevel!);
    const msgLevel = levels.indexOf(level);
    return msgLevel >= currentLevel;
  }

  /**
   * HTTP
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.req.request(config);
      return response.data;
    } catch (error) {
      this.log(` : ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  /**
   * GET
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * DELETE
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   *
   */
  getStorage(name: string) {
    const storageDir = path.join(__dirname, '../storage');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    const storageFile = path.join(storageDir, `${name}.json`);

    return {
      getItem: async (key: string): Promise<any> => {
        try {
          if (fs.existsSync(storageFile)) {
            const data = JSON.parse(fs.readFileSync(storageFile, 'utf-8'));
            return data[key];
          }
          return null;
        } catch (error) {
          this.log(` : ${(error as Error).message}`, 'error');
          return null;
        }
      },
      setItem: async (key: string, value: any): Promise<void> => {
        try {
          let data = {};
          if (fs.existsSync(storageFile)) {
            data = JSON.parse(fs.readFileSync(storageFile, 'utf-8'));
          }
          data[key] = value;
          fs.writeFileSync(storageFile, JSON.stringify(data, null, 2));
        } catch (error) {
          this.log(` : ${(error as Error).message}`, 'error');
        }
      },
      removeItem: async (key: string): Promise<void> => {
        try {
          if (fs.existsSync(storageFile)) {
            const data = JSON.parse(fs.readFileSync(storageFile, 'utf-8'));
            delete data[key];
            fs.writeFileSync(storageFile, JSON.stringify(data, null, 2));
          }
        } catch (error) {
          this.log(` : ${(error as Error).message}`, 'error');
        }
      },
    };
  }

  /**
   *
   */
  async done(): Promise<void> {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);

    this.log(` ${this.name}  ${duration} `, 'info');

    if (this.shouldNotify()) {
      await this.sendNotify();
    }

    console.log('\n' + '='.repeat(50));
    console.log(` `);
    console.log('='.repeat(50));
    console.log(` : ${this.msgs.filter((m) => !m.includes('') && !m.includes('')).length}`);
    console.log(` : ${this.msgs.filter((m) => m.includes('')).length}`);
    console.log(`  : ${this.msgs.filter((m) => m.includes('')).length}`);
    console.log('='.repeat(50));
  }

  /**
   *
   */
  private shouldNotify(): boolean {
    const { notifyType } = this.options;

    if (notifyType === 0) {
      return false;
    } else if (notifyType === 1) {
      return this.hasError;
    } else {
      return true;
    }
  }

  /**
   *
   */
  private async sendNotify(): Promise<void> {
    try {
      const notifyPath = path.join(__dirname, 'sendNotify.js');

      if (!fs.existsSync(notifyPath)) {
        this.log('  ', 'warn');
        return;
      }

      const sendNotify = require(notifyPath);
      const title = `${this.name}`;
      const content = this.msgs.join('\n');

      if (typeof sendNotify === 'function') {
        await sendNotify(title, content);
      } else if (sendNotify.sendNotify && typeof sendNotify.sendNotify === 'function') {
        await sendNotify.sendNotify(title, content);
      }
    } catch (error) {
      this.log(` : ${(error as Error).message}`, 'error');
    }
  }

  debug(msg: string): void {
    this.log(msg, 'debug');
  }
}

export default Env;
