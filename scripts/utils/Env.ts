/**
 * AutoPilot 环境管理类
 *
 * 提供统一的运行环境封装，包括：
 * - 多账号管理
 * - 日志记录
 * - 消息收集
 * - 通知发送
 * - 持久化存储
 *
 * @author Astral
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';

export interface EnvOptions {
  sep?: string[];  // 账号分隔符
  notifyType?: number;  // 通知策略：0-禁用, 1-仅异常, 2-全通知
  logLevel?: 'debug' | 'info' | 'warn' | 'error';  // 日志级别
}

export class Env {
  public index = 0;  // 当前账号索引
  public req: AxiosInstance;  // 请求实例
  public hasError = false;  // 错误状态
  public msgs: string[] = [];  // 消息收集
  public logs: string[] = [];  // 日志收集
  public startTime: number;  // 开始时间
  public options: EnvOptions;  // 配置选项

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

    // 初始化请求实例
    this.req = axios.create({
      timeout: Number(process.env.REQUEST_TIMEOUT) * 1000 || 30000,
      headers: {
        'User-Agent': process.env.USER_AGENT || 'AutoPilot/1.0',
      },
    });

    // 代理配置
    if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
      this.req.defaults.proxy = {
        host: process.env.HTTP_PROXY_HOST || '127.0.0.1',
        port: Number(process.env.HTTP_PROXY_PORT) || 7890,
      };
    }

    this.log(`🚀 ${this.name} 开始执行`, 'info');
  }

  /**
   * 初始化并执行任务
   */
  async init(TaskClass: any, envName: string): Promise<void> {
    try {
      const envValue = process.env[envName];

      if (!envValue) {
        this.log(`⚠️  未找到环境变量 ${envName}`, 'warn');
        this.msgs.push(`⚠️  未找到环境变量 ${envName}`);
        await this.done();
        return;
      }

      const users = this.parse(envValue, this.options.sep!);

      if (users.length === 0) {
        this.log(`⚠️  环境变量 ${envName} 为空`, 'warn');
        this.msgs.push(`⚠️  环境变量 ${envName} 为空`);
        await this.done();
        return;
      }

      this.log(`📊 共找到 ${users.length} 个账号`, 'info');

      for (const [idx, userConfig] of Object.entries(users)) {
        this.index = Number(idx);
        const task = new TaskClass(userConfig, this.index);
        await task.start();
      }

      await this.done();
    } catch (error) {
      this.log(`❌ 初始化失败: ${(error as Error).message}`, 'error');
      this.hasError = true;
      await this.done();
    }
  }

  /**
   * 解析多账号配置
   */
  private parse(envValue: string, seps: string[]): Record<string, string> {
    let sep = seps[0];

    // 检测使用的分隔符
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
   * 日志记录
   */
  log(msg: string, level: 'debug' | 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const logMsg = `[${timestamp}] [${level.toUpperCase()}] ${msg}`;

    // 控制台输出
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

    // 收集日志
    this.logs.push(logMsg);

    // 记录错误
    if (level === 'error') {
      this.hasError = true;
    }

    // 收集消息（用于通知）
    if (level !== 'debug') {
      this.msgs.push(msg);
    }
  }

  /**
   * 判断是否应该输出日志
   */
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevel = levels.indexOf(this.options.logLevel!);
    const msgLevel = levels.indexOf(level);
    return msgLevel >= currentLevel;
  }

  /**
   * HTTP 请求封装
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.req.request(config);
      return response.data;
    } catch (error) {
      this.log(`❌ 请求失败: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * 获取持久化存储
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
          this.log(`❌ 读取存储失败: ${(error as Error).message}`, 'error');
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
          this.log(`❌ 写入存储失败: ${(error as Error).message}`, 'error');
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
          this.log(`❌ 删除存储失败: ${(error as Error).message}`, 'error');
        }
      },
    };
  }

  /**
   * 完成任务并发送通知
   */
  async done(): Promise<void> {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);

    this.log(`✅ ${this.name} 执行完成，耗时 ${duration} 秒`, 'info');

    // 发送通知
    if (this.shouldNotify()) {
      await this.sendNotify();
    }

    // 输出总结
    console.log('\n' + '='.repeat(50));
    console.log(`📊 执行总结`);
    console.log('='.repeat(50));
    console.log(`✅ 成功: ${this.msgs.filter(m => !m.includes('❌') && !m.includes('⚠️')).length}`);
    console.log(`❌ 失败: ${this.msgs.filter(m => m.includes('❌')).length}`);
    console.log(`⚠️  警告: ${this.msgs.filter(m => m.includes('⚠️')).length}`);
    console.log('='.repeat(50));
  }

  /**
   * 判断是否应该发送通知
   */
  private shouldNotify(): boolean {
    const { notifyType } = this.options;

    if (notifyType === 0) {
      return false;  // 禁用通知
    } else if (notifyType === 1) {
      return this.hasError;  // 仅异常通知
    } else {
      return true;  // 全部通知
    }
  }

  /**
   * 发送通知
   */
  private async sendNotify(): Promise<void> {
    try {
      const notifyPath = path.join(__dirname, 'sendNotify.js');

      if (!fs.existsSync(notifyPath)) {
        this.log('⚠️  未找到通知模块', 'warn');
        return;
      }

      const sendNotify = require(notifyPath);
      const title = `【${this.name}】`;
      const content = this.msgs.join('\n');

      if (typeof sendNotify === 'function') {
        await sendNotify(title, content);
      } else if (sendNotify.sendNotify && typeof sendNotify.sendNotify === 'function') {
        await sendNotify.sendNotify(title, content);
      }
    } catch (error) {
      this.log(`❌ 发送通知失败: ${(error as Error).message}`, 'error');
    }
  }

  /**
   * 调试日志
   */
  debug(msg: string): void {
    this.log(msg, 'debug');
  }
}

export default Env;