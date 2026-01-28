/**
 * 
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * :
 *   ALIYUN_DRIVE_TOKEN: refresh_token &\n  @ 
 *
 * : https://www.aliyundrive.com/
 */

const axios = require('axios');
const { Env } = require('../../utils');

const $ = new Env('', { sep: ['@', '\n', '&'] });

class AliYunDrive {
  constructor(token, index) {
    this.token = token.trim();
    this.index = index;
    this.accessToken = null;
    this.signInCount = 0;
    this.nickname = '';
  }

  async refreshToken() {
    try {
      const response = await axios.post('https://auth.aliyundrive.com/v2/account/token', {
        grant_type: 'refresh_token',
        refresh_token: this.token
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        this.nickname = response.data.nick_name || `${this.index + 1}`;
        $.log(` ${this.index + 1} [${this.nickname}] Token`, 'info');
        return true;
      }

      $.log(` ${this.index + 1} Token`, 'error');
      return false;
    } catch (error) {
      $.log(` ${this.index + 1} Token: ${error.message}`, 'error');
      return false;
    }
  }

  async signIn() {
    try {
      const response = await axios.post('https://member.aliyundrive.com/v1/activity/sign_in_list', {}, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data.success && response.data.result) {
        this.signInCount = response.data.result.signInCount;
        const signInLogs = response.data.result.signInLogs || [];
        const todayLog = signInLogs.find(log => log.status === 'normal');

        if (todayLog) {
          $.log(` ${this.index + 1} [${this.nickname}] `, 'info');
          $.log(`   : ${this.signInCount} `, 'info');
          $.log(`   : ${todayLog.calendarChinese}`, 'info');

          if (todayLog.reward) {
            $.log(`   : ${todayLog.reward.notice}`, 'info');
            await this.claimReward(this.signInCount);
          }
        } else {
          $.log(` ${this.index + 1} [${this.nickname}] `, 'warn');
        }

        return true;
      }

      $.log(` ${this.index + 1} [${this.nickname}] `, 'error');
      return false;
    } catch (error) {
      $.log(` ${this.index + 1} [${this.nickname}] : ${error.message}`, 'error');
      return false;
    }
  }

  async claimReward(signInDay) {
    try {
      const response = await axios.post('https://member.aliyundrive.com/v1/activity/sign_in_reward', {
        signInDay: signInDay
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data.success && response.data.result) {
        $.log(`   : ${response.data.result.description}`, 'info');
      }
    } catch (error) {
      $.log(`: ${error.message}`, 'warn');
    }
  }

  async start() {
    $.log(`\n==========  ${this.index + 1} ==========`, 'info');

    if (!this.token) {
      $.log(`Token`, 'error');
      return;
    }

    if (await this.refreshToken()) {
      await this.signIn();
    }
  }
}

$.init(AliYunDrive, 'ALIYUN_DRIVE_TOKEN')
  .catch(error => {
    $.log(`: ${error.message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });
