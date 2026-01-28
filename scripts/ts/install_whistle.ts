/**
 * 安装Whistle脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   WHISTLE_VERSION: Whistle版本，默认为latest
 *
 * 参考文档: https://github.com/avwo/whistle
 */

import { Env } from '../utils';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const $ = new Env('安装Whistle', { sep: ['@', '
', '&'] });

class InstallWhistle {
  constructor(private version: string) {
    this.version = version || 'latest';
  }

  async install(): Promise<boolean> {
    try {
      $.log(`开始安装 Whistle，版本: ${this.version}`, 'info');

      const { stdout, stderr } = await execAsync(`npm install -g whistle@${this.version}`);

      if (stdout) {
        $.log(stdout, 'info');
      }

      if (stderr) {
        $.log(stderr, 'warn');
      }

      $.log(`Whistle 安装成功`, 'info');
      $.log(`启动命令: w2 start`, 'info');
      $.log(`访问地址: http://127.0.0.1:8899`, 'info');

      return true;
    } catch (error) {
      $.log(`Whistle 安装失败: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    await this.install();
  }
}

$.init(InstallWhistle, 'WHISTLE_VERSION')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });