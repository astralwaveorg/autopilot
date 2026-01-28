/**
 * 阿里云盘自动签到脚本
 * * @Author: Astral
 * @Date: 2026-01-28
 * @Version: 2.1.0
 * * 环境变量：
 * ALIYUN_DRIVE_TOKEN: refresh_token，多账号支持分隔符：@ 或 换行 或 &
 * * 示例：
 * ALIYUN_DRIVE_TOKEN="token1@token2"
 */

const axios = require('axios');

const CONFIG = {
  key: 'ALIYUN_DRIVE_TOKEN',
  splitters: ['@', '\n', '&'],
  timeout: 15000,
  api: {
    token: 'https://auth.aliyundrive.com/v2/account/token',
    signIn: 'https://member.aliyundrive.com/v1/activity/sign_in_list',
    reward: 'https://member.aliyundrive.com/v1/activity/sign_in_reward',
  },
};

class AliYunDrive {
  constructor(token, index) {
    this.token = token.trim();
    this.index = index + 1;
    this.accessToken = null;
    this.nickname = '';
    this.client = axios.create({
      timeout: CONFIG.timeout,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  log(msg, level = 'info') {
    const label = level === 'error' ? '[ERROR]' : '[INFO]';
    console.log(`${label} 账号 ${this.index}${this.nickname ? ` [${this.nickname}]` : ''}: ${msg}`);
  }

  async refreshToken() {
    try {
      const { data } = await this.client.post(CONFIG.api.token, {
        grant_type: 'refresh_token',
        refresh_token: this.token,
      });

      if (data.access_token) {
        this.accessToken = data.access_token;
        this.nickname = data.nick_name || '';
        return true;
      }
      this.log('刷新Token失败: 响应数据缺失', 'error');
      return false;
    } catch (error) {
      this.log(`Token刷新异常: ${error.message}`, 'error');
      return false;
    }
  }

  async signIn() {
    try {
      const { data } = await this.client.post(
        CONFIG.api.signIn,
        {},
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );

      if (data.success && data.result) {
        const { signInCount, signInLogs } = data.result;
        const todayLog = signInLogs?.find((log) => log.status === 'normal');

        this.log(`连续签到 ${signInCount || 0} 天`);

        if (todayLog) {
          if (todayLog.reward?.notice) this.log(`今日奖励: ${todayLog.reward.notice}`);
          if (!todayLog.isReward && signInCount > 0) {
            await this.claimReward(signInCount);
          }
        }
        return true;
      }
      this.log('签到请求未成功', 'error');
      return false;
    } catch (error) {
      this.log(`签到接口异常: ${error.message}`, 'error');
      return false;
    }
  }

  async claimReward(signInDay) {
    try {
      const { data } = await this.client.post(
        CONFIG.api.reward,
        { signInDay },
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );

      if (data.success && data.result) {
        this.log(`领取奖励成功: ${data.result.description || data.result.notice || '已入账'}`);
      } else {
        this.log('领取奖励失败', 'error');
      }
    } catch (error) {
      this.log(`奖励领取异常: ${error.message}`, 'error');
    }
  }

  async run() {
    if (!this.token) {
      this.log('无效的Token', 'error');
      return;
    }
    if (await this.refreshToken()) {
      await this.signIn();
    }
  }
}

async function main() {
  const rawData = process.env[CONFIG.key] || '';
  if (!rawData) {
    console.log(`[ERROR] 未检测到环境变量 ${CONFIG.key}`);
    return;
  }

  const splitter = CONFIG.splitters.find((s) => rawData.includes(s)) || CONFIG.splitters[0];
  const tokens = rawData.split(splitter).filter((t) => t.trim().length > 0);

  console.log(`[INFO] 发现 ${tokens.length} 个账号，开始执行任务...\n`);

  for (let i = 0; i < tokens.length; i++) {
    const task = new AliYunDrive(tokens[i], i);
    await task.run();
  }
}

main()
  .catch((err) => {
    console.error(`[CRITICAL] 脚本异常中断: ${err.message}`);
  })
  .finally(() => {
    console.log('\n[INFO] 任务处理完成');
  });
