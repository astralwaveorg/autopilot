/**
 * NewAPI通用签到脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   NEWAPI_URL: NewAPI地址，多个账号用 &、\n 或 @ 分隔
 *   NEWAPI_KEY: NewAPI密钥，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://github.com/Calcium-Ion/new-api
 */

import { Env } from '../utils';

const $ = new Env('NewAPI通用签到', { sep: ['@', '\n', '&'] });

class NewAPI {
  constructor(private config: string, private index: number) {
    const parts = config.split('#');
    this.url = parts[0].trim();
    this.apiKey = parts[1].trim();
    this.siteName = parts.length > 2 ? parts[2].trim() : `站点${this.index + 1}`;
  }

  async signIn(): Promise<boolean> {
    try {
      const { data: res } = await $.req.post(`${this.url}/api/user/checkin`, {}, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.success) {
        const balance = res.data.balance || 0;
        $.log(`账号 ${this.index + 1} [${this.siteName}] 签到成功`, 'info');
        $.log(`   余额: ${balance}`, 'info');
        return true;
      } else {
        $.log(`账号 ${this.index + 1} [${this.siteName}] 签到失败: ${res.message || '未知错误'}`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} [${this.siteName}] 签到异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.url || !this.apiKey) {
      $.log(`URL或API Key为空`, 'error');
      return;
    }

    await this.signIn();
  }
}

$.init(NewAPI, 'NEWAPI_CONFIG')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });