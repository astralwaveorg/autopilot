/**
 * 喜马拉雅自动签到脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   XIMALAYA_COOKIE: 喜马拉雅Cookie，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://www.ximalaya.com/
 */

import { Env } from '../utils';

const $ = new Env('喜马拉雅签到', { sep: ['@', '\n', '&'] });

class Ximalaya {
  constructor(private cookie: string, private index: number) {
    this.nickname = '';
  }

  async signIn(): Promise<boolean> {
    try {
      const { data: res } = await $.req.get('https://m.ximalaya.com/webview/signin', {
        headers: {
          'Cookie': this.cookie
        }
      });

      if (res.code === 0 && res.data) {
        this.nickname = res.data.nickname || `账号${this.index + 1}`;
        const reward = res.data.reward;

        if (reward) {
          $.log(`账号 ${this.index + 1} [${this.nickname}] 签到成功`, 'info');
          $.log(`   奖励: ${reward.name} ${reward.desc}`, 'info');
        } else {
          $.log(`账号 ${this.index + 1} [${this.nickname}] 签到成功，无奖励`, 'info');
        }

        return true;
      } else {
        $.log(`账号 ${this.index + 1} 签到失败: ${res.message || '未知错误'}`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} 签到异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.cookie) {
      $.log(`Cookie为空`, 'error');
      return;
    }

    await this.signIn();
  }
}

$.init(Ximalaya, 'XIMALAYA_COOKIE')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });