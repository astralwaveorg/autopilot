/**
 * 云闪付自动签到脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   UNIONPAY_TOKEN: 云闪付Authorization Token，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://youhui.95516.com/
 */

const axios = require('axios');
const { Env } = require('../../utils');

const $ = new Env('云闪付签到', { sep: ['@', '\n', '&'] });

class UnionPay {
  constructor(token, index) {
    this.token = token.trim();
    this.index = index;
  }

  async signIn() {
    try {
      const response = await axios.post('https://youhui.95516.com/newsign/api/daily_sign_in', {}, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${this.token}`,
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
          'Connection': 'keep-alive',
        },
        timeout: 10000
      });

      if (response.data.signedIn) {
        const currentDays = response.data.signInDays.current.days;
        const totalDays = response.data.signInDays.days;
        $.log(`账号 ${this.index + 1} 签到成功，连续签到 ${currentDays} 天，累计签到 ${totalDays} 天`, 'info');
      } else {
        $.log(`账号 ${this.index + 1} 签到失败`, 'error');
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} 签到异常: ${error.message}`, 'error');
    }
  }

  async start() {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.token) {
      $.log(`Token为空`, 'error');
      return;
    }

    await this.signIn();
  }
}

$.init(UnionPay, 'UNIONPAY_TOKEN')
  .catch(error => {
    $.log(`程序执行失败: ${error.message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });