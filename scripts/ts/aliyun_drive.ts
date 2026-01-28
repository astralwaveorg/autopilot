/**
 * 阿里云盘自动签到脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   ALIYUN_DRIVE_TOKEN: 阿里云盘refresh_token，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://www.aliyundrive.com/
 */

import { Env } from '../utils';

const $ = new Env('阿里云盘签到', { sep: ['@', '\n', '&'] });

class AliYunDrive {
  constructor(private token: string, private index: number) {
    this.accessToken = '';
    this.nickname = '';
    this.signInCount = 0;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const { data: res } = await $.req.post('https://auth.aliyundrive.com/v2/account/token', {
        grant_type: 'refresh_token',
        refresh_token: this.token
      });

      if (res.access_token) {
        this.accessToken = res.access_token;
        this.nickname = res.nick_name || `账号${this.index + 1}`;
        $.log(`账号 ${this.index + 1} [${this.nickname}] Token刷新成功`, 'info');
        return true;
      }

      $.log(`账号 ${this.index + 1} Token刷新失败`, 'error');
      return false;
    } catch (error) {
      $.log(`账号 ${this.index + 1} Token刷新异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async signIn(): Promise<boolean> {
    try {
      const { data: res } = await $.req.post('https://member.aliyundrive.com/v1/activity/sign_in_list', {}, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.success && res.result) {
        this.signInCount = res.result.signInCount;
        const signInLogs = res.result.signInLogs || [];
        const todayLog = signInLogs.find((log: any) => log.status === 'normal');

        if (todayLog) {
          $.log(`账号 ${this.index + 1} [${this.nickname}] 签到成功`, 'info');
          $.log(`   累计签到: ${this.signInCount} 天`, 'info');
          $.log(`   日期: ${todayLog.calendarChinese}`, 'info');

          if (todayLog.reward) {
            $.log(`   奖励: ${todayLog.reward.notice}`, 'info');
            await this.claimReward(this.signInCount);
          }
        } else {
          $.log(`账号 ${this.index + 1} [${this.nickname}] 今日已签到`, 'warn');
        }

        return true;
      }

      $.log(`账号 ${this.index + 1} [${this.nickname}] 签到失败`, 'error');
      return false;
    } catch (error) {
      $.log(`账号 ${this.index + 1} [${this.nickname}] 签到异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async claimReward(signInDay: number): Promise<void> {
    try {
      const { data: res } = await $.req.post('https://member.aliyundrive.com/v1/activity/sign_in_reward', {
        signInDay: signInDay
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.success && res.result) {
        $.log(`   领取奖励: ${res.result.description}`, 'info');
      }
    } catch (error) {
      $.log(`领取奖励失败: ${(error as Error).message}`, 'warn');
    }
  }

  async start(): Promise<void> {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.token) {
      $.log(`Token为空`, 'error');
      return;
    }

    if (await this.refreshToken()) {
      await this.signIn();
    }
  }
}

$.init(AliYunDrive, 'ALIYUN_DRIVE_TOKEN')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });