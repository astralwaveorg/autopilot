/**
 * 东方飞讯签到脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   DFFX_COOKIE: 东方飞讯Cookie，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://www.dffx.com/
 */

const { Env } = require('../../utils');

const $ = new Env('东方飞讯签到', { sep: ['@', '\n', '&'] });

class Dffx {
  constructor(cookie, index) {
    this.cookie = cookie.trim();
    this.index = index;
    this.nickname = '';
  }

  async signIn() {
    try {
      const response = await $.req.get('https://www.dffx.com/api/user/sign', {
        headers: {
          'Cookie': this.cookie,
          'Content-Type': 'application/json'
        }
      });

      const res = response.data;

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
      $.log(`账号 ${this.index + 1} 签到异常: ${error.message}`, 'error');
      return false;
    }
  }

  async start() {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.cookie) {
      $.log(`Cookie为空`, 'error');
      return;
    }

    await this.signIn();
  }
}

$.init(Dffx, 'DFFX_COOKIE')
  .catch(error => {
    $.log(`程序执行失败: ${error.message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });