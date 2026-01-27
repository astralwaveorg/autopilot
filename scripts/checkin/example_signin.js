/*
 * @Author: Astral
 * @Date: 2025-01-27
 * @LastEditors: Astral
 * @LastEditTime: 2025-01-27
 * @Description: 示例签到脚本
 * @cron: 30 7 * * *
 * @new Env('示例签到')
 * @环境变量: EXAMPLE_TOKEN 示例Token，多个账号使用 &、\n 或 @ 分隔
 */

const axios = require('axios');
const { Env } = require('./utils/Env.js');

const $ = new Env('示例签到', { sep: ['@', '\n', '&'] });

class SignInTask {
  constructor(config, index) {
    this.config = config;
    this.index = index;
    this.token = config.trim();
    this.userInfo = null;
  }

  async start() {
    try {
      $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

      // 检查 Token
      if (!this.token) {
        $.log('❌ Token 为空', 'error');
        return;
      }

      // 获取用户信息
      await this.getUserInfo();
      if (!this.userInfo) {
        $.log('❌ 获取用户信息失败', 'error');
        return;
      }

      $.log(`👤 用户: ${this.userInfo.username}`, 'info');

      // 执行签到
      await this.signIn();

      // 获取签到奖励
      await this.getReward();

      $.log(`✅ 账号 ${this.index + 1} 执行完成`, 'info');
    } catch (error) {
      $.log(`❌ 账号 ${this.index + 1} 执行失败: ${error.message}`, 'error');
    }
  }

  async getUserInfo() {
    try {
      $.log('📋 获取用户信息...', 'info');

      const response = await axios.get('https://api.example.com/user/info', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'User-Agent': 'AutoPilot/1.0',
        },
        timeout: 10000,
      });

      if (response.data && response.data.code === 200) {
        this.userInfo = response.data.data;
        $.log(`✅ 获取用户信息成功`, 'info');
        return true;
      } else {
        $..log(`❌ 获取用户信息失败: ${response.data?.message}`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`❌ 获取用户信息异常: ${error.message}`, 'error');
      return false;
    }
  }

  async signIn() {
    try {
      $.log('📝 开始签到...', 'info');

      const response = await axios.post(
        'https://api.example.com/user/signin',
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'User-Agent': 'AutoPilot/1.0',
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.code === 200) {
        const { points, days } = response.data.data;
        $.log(`✅ 签到成功，获得 ${points} 积分，连续签到 ${days} 天`, 'info');
        return true;
      } else if (response.data?.code === 400 && response.data?.message?.includes('已签到')) {
        $.log('⚠️  今日已签到', 'warn');
        return true;
      } else {
        $.log(`❌ 签到失败: ${response.data?.message}`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`❌ 签到异常: ${error.message}`, 'error');
      return false;
    }
  }

  async getReward() {
    try {
      $.log('🎁 领取签到奖励...', 'info');

      const response = await axios.post(
        'https://api.example.com/user/reward',
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'User-Agent': 'AutoPilot/1.0',
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.code === 200) {
        const reward = response.data.data;
        $.log(`✅ 领取奖励成功: ${reward.name}`, 'info');
        return true;
      } else if (response.data?.code === 400 && response.data?.message?.includes('已领取')) {
        $.log('⚠️  奖励已领取', 'warn');
        return true;
      } else {
        $.log(`⚠️  领取奖励失败: ${response.data?.message}`, 'warn');
        return false;
      }
    } catch (error) {
      $.log(`⚠️  领取奖励异常: ${error.message}`, 'warn');
      return false;
    }
  }
}

// 主程序
$.init(SignInTask, 'EXAMPLE_TOKEN')
  .catch(error => {
    $.log(`❌ 程序执行失败: ${error.message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });