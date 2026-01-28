/**
 * 潮新闻签到
 * cron: 0 9 * * *
 * @Author: Astral
 * @Date: 2026-01-28
 * @Version: 1.0.0
 * 环境变量: CHAOXINWEN_COOKIE (潮新闻Cookie，多账号使用 @ 或 & 或 换行 分割)
 */

const axios = require('axios');

// 模拟 AutoPilot 环境类
const $ = {
  name: '潮新闻签到',
  env_name: 'CHAOXINWEN_COOKIE',

  log(msg, level = 'INFO') {
    console.log(`[${level}] ${msg}`);
  },

  get_envs() {
    let env_str = process.env[this.env_name] || '';
    if (!env_str) return [];

    // 适配分割符 ['@', '\n', '&']
    let accounts = [];
    if (env_str.includes('@')) {
      accounts = env_str.split('@');
    } else if (env_str.includes('&')) {
      accounts = env_str.split('&');
    } else if (env_str.includes('\n')) {
      accounts = env_str.split('\n');
    } else {
      accounts = [env_str];
    }
    return accounts.map((item) => item.trim()).filter((item) => item !== '');
  },

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

class Task {
  constructor(cookie, index) {
    this.cookie = cookie;
    this.index = index + 1;
    this.client = axios.create({
      baseURL: 'https://www.chaoxinwen.com/api',
      timeout: 15000,
      headers: {
        Cookie: this.cookie,
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      },
    });
  }

  async signIn() {
    try {
      const { data: res } = await this.client.get('/user/sign');
      if (res && res.code === 0) {
        const nickname = res.data?.nickname || `账号${this.index}`;
        const reward = res.data?.reward;
        const msg = reward ? `${reward.name} ${reward.desc}` : '无奖励信息';
        $.log(`账号 [${nickname}] 签到成功: ${msg}`);
      } else {
        $.log(`账号 [${this.index}] 签到失败: ${res?.message || '未知错误'}`, 'WARN');
      }
    } catch (error) {
      $.log(`账号 [${this.index}] 请求异常: ${error.message}`, 'ERROR');
    }
  }

  async run() {
    await this.signIn();
  }
}

async function main() {
  const cookies = $.get_envs();
  if (cookies.length === 0) {
    $.log(`未找到环境变量 ${$.env_name}`, 'ERROR');
    return;
  }

  $.log(`发现 ${cookies.length} 个账号`);
  for (let i = 0; i < cookies.length; i++) {
    $.log(`开始执行第 ${i + 1} 个账号`);
    const worker = new Task(cookies[i], i);
    await worker.run();

    // 账号间随机延迟 1-3s
    if (i < cookies.length - 1) {
      const delay = Math.floor(Math.random() * 2000) + 1000;
      await $.wait(delay);
    }
  }
}

main()
  .catch((e) => $.log(`脚本异常中断: ${e.message}`, 'ERROR'))
  .finally(() => $.log('全部任务执行完毕'));
