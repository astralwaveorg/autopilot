/**
 * AICNN签到脚本
 * cron: 0 0 9 * * *
 * @Author: Astral
 * @Date: 2026-01-28
 * @Version: 1.0.0
 * 环境变量: AICNN_COOKIE (必填)
 */
import { Env } from '../utils';

const $ = new Env('AICNN签到');

class Aicnn {
  private nickname: string = '';

  constructor(
    private cookie: string,
    private index: number
  ) {}

  async signIn(): Promise<boolean> {
    try {
      const res: any = await $.get('https://www.aicnn.com/api/user/sign', {
        headers: {
          Cookie: this.cookie,
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        },
      });

      if (res && res.code === 0) {
        this.nickname = res.data?.nickname || `账号${this.index + 1}`;
        const reward = res.data?.reward;

        if (reward) {
          $.log(`账号 ${this.index + 1} [${this.nickname}] 签到成功`, 'info');
          $.log(`奖励: ${reward.name} ${reward.desc}`, 'info');
        } else {
          $.log(`账号 ${this.index + 1} [${this.nickname}] 签到成功 (无奖励信息)`, 'info');
        }
        return true;
      } else {
        $.log(`账号 ${this.index + 1} 签到失败: ${res?.message || '响应数据异常'}`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} 网络异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    if (!this.cookie) {
      $.log(`账号 ${this.index + 1} 跳过: Cookie缺失`, 'warn');
      return;
    }
    await this.signIn();
  }
}

$.init(Aicnn, 'AICNN_COOKIE');
