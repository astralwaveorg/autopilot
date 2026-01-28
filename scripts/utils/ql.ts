/**
 * AutoPilot  API 
 *
 *  API 
 * - 
 * - 
 * - 
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
   *  Token
   */
  private getToken(): string {
    //  Token
    if (process.env.QL_TOKEN) {
      return process.env.QL_TOKEN;
    }

    //  Token
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

    throw new Error(' Token QL_TOKEN ');
  }

  /**
   * 
   */
  private getHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
   */
  async getEnvByName(name: string): Promise<EnvVar[]> {
    return this.getEnvs(name);
  }

  /**
   * 
   */
  async getEnvsCount(): Promise<number> {
    const envs = await this.getEnvs();
    return envs.length;
  }

  /**
   *  ID 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
   */
  async getTasks(): Promise<Task[]> {
    try {
      const response = await this.api.get('/crons', {
        headers: this.getHeaders(),
        params: { t: Date.now() },
      });

      return response.data.data || [];
    } catch (error) {
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   *  ID 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
   */
  async getSystemInfo(): Promise<any> {
    try {
      const response = await this.api.get('/system', {
        headers: this.getHeaders(),
        params: { t: Date.now() },
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`: ${(error as Error).message}`);
    }
  }

  /**
   * 
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