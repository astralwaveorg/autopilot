/**
 * AutoPilot 青龙 API 封装
 *
 * 提供青龙面板 API 的封装，包括：
 * - 环境变量管理
 * - 任务管理
 * - 系统信息获取
 *
 * @author Astral
 * @version 1.0.0
 */

import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export interface EnvVar {
  _id?: string;
  id?: string;
  name: string;
  value: string;
  remarks?: string;
  status?: number;
  created?: number;
  updated?: number;
}

export interface Task {
  _id?: string;
  id?: string;
  name: string;
  command: string;
  schedule: string;
  status?: number;
  created?: number;
  updated?: number;
}

export class QLAPI {
  private api: AxiosInstance;
  private token: string;
  private host: string;

  constructor(host: string = 'http://127.0.0.1:5700') {
    this.host = host;
    this.token = this.getToken();
    this.api = axios.create({
      baseURL: `${this.host}/api`,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 获取 Token
   */
  private getToken(): string {
    // 优先使用环境变量中的 Token
    if (process.env.QL_TOKEN) {
      return process.env.QL_TOKEN;
    }

    // 从文件中读取 Token
    const possiblePaths = [
      '/ql/data/config/auth.json',
      '/ql/config/auth.json',
      path.join(__dirname, '../../data/config/auth.json'),
      path.join(__dirname, '../../config/auth.json'),
    ];

    for (const filepath of possiblePaths) {
      try {
        if (fs.existsSync(filepath)) {
          const auth = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
          return auth.token;
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error('无法获取青龙 Token，请配置环境变量 QL_TOKEN 或确保青龙配置文件存在');
  }

  /**
   * 获取请求头
   */
  private getHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }

  /**
   * 获取所有环境变量
   */
  async getEnvs(searchValue?: string): Promise<EnvVar[]> {
    try {
      const params: any = { t: Date.now() };
      if (searchValue) {
        params.searchValue = searchValue;
      }

      const response = await this.api.get('/envs', {
        headers: this.getHeaders(),
        params,
      });

      return response.data.data || [];
    } catch (error) {
      throw new Error(`获取环境变量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取指定名称的环境变量
   */
  async getEnvByName(name: string): Promise<EnvVar[]> {
    return this.getEnvs(name);
  }

  /**
   * 获取环境变量数量
   */
  async getEnvsCount(): Promise<number> {
    const envs = await this.getEnvs();
    return envs.length;
  }

  /**
   * 根据 ID 获取环境变量
   */
  async getEnvById(id: string): Promise<EnvVar | null> {
    try {
      const envs = await this.getEnvs();
      for (const env of envs) {
        const envId = env._id || env.id;
        if (envId === id) {
          return env;
        }
      }
      return null;
    } catch (error) {
      throw new Error(`获取环境变量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 添加环境变量
   */
  async addEnv(name: string, value: string, remarks?: string): Promise<EnvVar> {
    try {
      const response = await this.api.post(
        '/envs',
        [{
          name,
          value,
          remarks: remarks || '',
        }],
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(`添加环境变量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 更新环境变量
   */
  async updateEnv(id: string, name: string, value: string, remarks?: string): Promise<EnvVar> {
    try {
      const response = await this.api.put(
        '/envs',
        {
          _id: id,
          id,
          name,
          value,
          remarks: remarks || '',
        },
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(`更新环境变量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 删除环境变量
   */
  async deleteEnv(ids: string[]): Promise<void> {
    try {
      await this.api.delete(
        '/envs',
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
          data: ids,
        }
      );
    } catch (error) {
      throw new Error(`删除环境变量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 启用环境变量
   */
  async enableEnv(ids: string[]): Promise<void> {
    try {
      await this.api.put(
        '/envs/enable',
        ids,
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );
    } catch (error) {
      throw new Error(`启用环境变量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 禁用环境变量
   */
  async disableEnv(ids: string[]): Promise<void> {
    try {
      await this.api.put(
        '/envs/disable',
        ids,
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );
    } catch (error) {
      throw new Error(`禁用环境变量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取所有任务
   */
  async getTasks(): Promise<Task[]> {
    try {
      const response = await this.api.get('/crons', {
        headers: this.getHeaders(),
        params: { t: Date.now() },
      });

      return response.data.data || [];
    } catch (error) {
      throw new Error(`获取任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 根据 ID 获取任务
   */
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const tasks = await this.getTasks();
      for (const task of tasks) {
        const taskId = task._id || task.id;
        if (taskId === id) {
          return task;
        }
      }
      return null;
    } catch (error) {
      throw new Error(`获取任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 添加任务
   */
  async addTask(
    name: string,
    command: string,
    schedule: string,
    labels?: string[]
  ): Promise<Task> {
    try {
      const response = await this.api.post(
        '/crons',
        {
          name,
          command,
          schedule,
          labels: labels || [],
        },
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(`添加任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 更新任务
   */
  async updateTask(
    id: string,
    name: string,
    command: string,
    schedule: string,
    labels?: string[]
  ): Promise<Task> {
    try {
      const response = await this.api.put(
        '/crons',
        {
          _id: id,
          id,
          name,
          command,
          schedule,
          labels: labels || [],
        },
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(`更新任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 删除任务
   */
  async deleteTask(ids: string[]): Promise<void> {
    try {
      await this.api.delete(
        '/crons',
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
          data: ids,
        }
      );
    } catch (error) {
      throw new Error(`删除任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 启用任务
   */
  async enableTask(ids: string[]): Promise<void> {
    try {
      await this.api.put(
        '/crons/enable',
        ids,
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );
    } catch (error) {
      throw new Error(`启用任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 禁用任务
   */
  async disableTask(ids: string[]): Promise<void> {
    try {
      await this.api.put(
        '/crons/disable',
        ids,
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );
    } catch (error) {
      throw new Error(`禁用任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 运行任务
   */
  async runTask(ids: string[]): Promise<void> {
    try {
      await this.api.put(
        '/crons/run',
        ids,
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );
    } catch (error) {
      throw new Error(`运行任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 停止任务
   */
  async stopTask(ids: string[]): Promise<void> {
    try {
      await this.api.put(
        '/crons/stop',
        ids,
        {
          headers: this.getHeaders(),
          params: { t: Date.now() },
        }
      );
    } catch (error) {
      throw new Error(`停止任务失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取系统信息
   */
  async getSystemInfo(): Promise<any> {
    try {
      const response = await this.api.get('/system', {
        headers: this.getHeaders(),
        params: { t: Date.now() },
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`获取系统信息失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取环境变量状态
   */
  async getEnvStatus(id: string): Promise<number> {
    try {
      const env = await this.getEnvById(id);
      return env?.status ?? 99;
    } catch (error) {
      return 99;
    }
  }
}

export default QLAPI;