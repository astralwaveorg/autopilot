/*
 * @Author: Astral
 * @Date: 2025-01-27
 * @LastEditors: Astral
 * @LastEditTime: 2025-01-27
 * @Description: 脚本功能描述
 * @cron: 30 7 * * *
 * @new Env('脚本名称')
 * @环境变量: ENV_VAR_NAME 变量说明，多个账号使用 &、\n 或 @ 分隔
 */

import { Env } from '../utils';

const $ = new Env('脚本名称', { sep: ['@', '\n', '&'] });

/**
 * 任务类
 */
class Task {
  constructor(private config: string, private index: number) {
    // 初始化配置
  }

  /**
   * 主入口
   */
  async start(): Promise<void> {
    try {
      $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

      // 检查配置
      if (!this.config || !this.config.trim()) {
        $.log('❌ 配置为空', 'error');
        return;
      }

      // 业务逻辑
      await this.main();

      $.log(`✅ 账号 ${this.index + 1} 执行完成`, 'info');
    } catch (error) {
      $.log(`❌ 账号 ${this.index + 1} 执行失败: ${(error as Error).message}`, 'error');
      console.error(error);
    }
  }

  /**
   * 主逻辑
   */
  private async main(): Promise<void> {
    // 1. 获取用户信息
    await this.getUserInfo();

    // 2. 执行签到
    await this.signIn();

    // 3. 领取奖励
    await this.getReward();
  }

  /**
   * 获取用户信息
   */
  private async getUserInfo(): Promise<void> {
    try {
      $.log('📋 获取用户信息...', 'info');

      const response = await $.get('https://api.example.com/user/info', {
        headers: {
          'Authorization': `Bearer ${this.config}`,
        },
      });

      if (response.code === 200) {
        $.log(`✅ 用户: ${response.data.username}`, 'info');
      } else {
        $.log(`❌ 获取用户信息失败: ${response.message}`, 'error');
      }
    } catch (error) {
      $.log(`❌ 获取用户信息异常: ${(error as Error).message}`, 'error');
    }
  }

  /**
   * 签到
   */
  private async signIn(): Promise<void> {
    try {
      $.log('📝 开始签到...', 'info');

      const response = await $.post('https://api.example.com/user/signin');

      if (response.code === 200) {
        $.log(`✅ 签到成功，获得 ${response.data.points} 积分`, 'info');
      } else if (response.code === 400 && response.message.includes('已签到')) {
        $.log('⚠️  今日已签到', 'warn');
      } else {
        $.log(`❌ 签到失败: ${response.message}`, 'error');
      }
    } catch (error) {
      $.log(`❌ 签到异常: ${(error as Error).message}`, 'error');
    }
  }

  /**
   * 领取奖励
   */
  private async getReward(): Promise<void> {
    try {
      $.log('🎁 领取奖励...', 'info');

      const response = await $.post('https://api.example.com/user/reward');

      if (response.code === 200) {
        $.log(`✅ 领取奖励成功: ${response.data.name}`, 'info');
      } else if (response.code === 400 && response.message.includes('已领取')) {
        $.log('⚠️  奖励已领取', 'warn');
      } else {
        $.log(`⚠️  领取奖励失败: ${response.message}`, 'warn');
      }
    } catch (error) {
      $.log(`⚠️  领取奖励异常: ${(error as Error).message}`, 'warn');
    }
  }
}

// 初始化并执行
$.init(Task, 'ENV_VAR_NAME')
  .catch(error => {
    $.log(`❌ 程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });