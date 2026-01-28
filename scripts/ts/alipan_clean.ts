/**
 * 阿里云盘清理脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   ALIPAN_TOKEN: 阿里云盘Token，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://www.alipan.com/
 */

import { Env } from '../utils';

const $ = new Env('阿里云盘清理', { sep: ['@', '\n', '&'] });

class AlipanClean {
  constructor(private token: string, private index: number) {
    this.accessToken = null;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const { data: res } = await $.req.post('https://auth.aliyundrive.com/v2/account/token', {
        grant_type: 'refresh_token',
        refresh_token: this.token
      });

      if (res.access_token) {
        this.accessToken = res.access_token;
        $.log(`账号 ${this.index + 1} Token刷新成功`, 'info');
        return true;
      } else {
        $.log(`账号 ${this.index + 1} Token刷新失败`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} Token刷新异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async getRecycleBin(): Promise<any[]> {
    try {
      const { data: res } = await $.req.post('https://api.alipan.com/adrive/v1/recyclebin/list', {
        'drive_id': 'default',
        'limit': 200
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (res.items) {
        return res.items;
      }
      return [];
    } catch (error) {
      $.log(`账号 ${this.index + 1} 获取回收站失败: ${(error as Error).message}`, 'error');
      return [];
    }
  }

  async cleanRecycleBin(): Promise<boolean> {
    try {
      const items = await this.getRecycleBin();

      if (items.length === 0) {
        $.log(`账号 ${this.index + 1} 回收站为空`, 'info');
        return true;
      }

      const { data: res } = await $.req.post('https://api.alipan.com/adrive/v1/recyclebin/clear', {
        'drive_id': 'default'
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (res.success) {
        $.log(`账号 ${this.index + 1} 回收站清理成功，已清理 ${items.length} 项`, 'info');
        return true;
      } else {
        $.log(`账号 ${this.index + 1} 回收站清理失败`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} 回收站清理异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.token) {
      $.log(`Token为空`, 'error');
      return;
    }

    const refreshSuccess = await this.refreshToken();
    if (!refreshSuccess) {
      return;
    }

    await this.cleanRecycleBin();
  }
}

$.init(AlipanClean, 'ALIPAN_TOKEN')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });