/**
 * ikuuu机场签到脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   IKUUU_URL: ikuuu机场地址，多个账号用 &、\n 或 @ 分隔
 *   IKUUU_TOKEN: ikuuu Token，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://www.ikuuu.com/
 */

import { Env } from '../utils';

const $ = new Env('ikuuu机场签到', { sep: ['@', '\n', '&'] });

class Ikuuu {
  constructor(private config: string, private index: number) {
    const parts = config.split('#');
    this.url = parts[0].trim();
    this.token = parts[1].trim();
    this.siteName = parts.length > 2 ? parts[2].trim() : `站点${this.index + 1}`;
  }

  async signIn(): Promise<boolean> {
    try {
      const { data: res } = await $.req.post(`${this.url}/api/user/checkin`, {}, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.success || res.ret === 1) {
        const balance = res.data?.balance || res.msg || '未知';
        $.log(`账号 ${this.index + 1} [${this.siteName}] 签到成功`, 'info');
        $.log(`   余额: ${balance}`, 'info');
        return true;
      } else {
        $.log(`账号 ${this.index + 1} [${this.siteName}] 签到失败: ${res.msg || '未知错误'}`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} [${this.siteName}] 签到异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.url || !this.token) {
      $.log(`URL或Token为空`, 'error');
      return;
    }

    await this.signIn();
  }
}

$.init(Ikuuu, 'IKUUU_CONFIG')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });
