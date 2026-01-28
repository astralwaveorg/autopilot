/**
 * 潮新闻自动签到脚本
 * * @Author: Astral
 * @Date: 2026-01-28
 * @Version: 1.0.0
 * * 环境变量：
 * CHAOXINWEN_COOKIE: 潮新闻Cookie，多账号支持分隔符：@ 或 换行 或 &
 * * 示例：
 * CHAOXINWEN_COOKIE="cookie1@cookie2"
 */

const axios = require('axios');

const Env = {
  name: '潮新闻签到',
  variable: 'CHAOXINWEN_COOKIE',
  splitters: ['@', '\n', '&'],

  log(msg, level = 'info') {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${msg}`);
  },

  getCookies() {
    const raw = process.env[this.variable] || '';
    if (!raw) return [];
    let splitChar = this.splitters.find((s) => raw.includes(s)) || this.splitters[0];
    return raw.split(splitChar).filter((item) => item.trim() !== '');
  },
};

class Chaoxinwen {
  constructor(cookie, index) {
    this.cookie = cookie.trim();
    this.index = index + 1;
    this.client = axios.create({
      baseURL: 'https://www.chaoxinwen.com/api',
      timeout: 10000,
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

        if (reward) {
          Env.log(`账号 ${this.index} [${nickname}] 签到成功: ${reward.name} ${reward.desc}`);
        } else {
          Env.log(`账号 ${this.index} [${nickname}] 签到成功 (无奖励信息)`);
        }
        return true;
      } else {
        Env.log(`账号 ${this.index} 签到失败: ${res?.message || '响应格式错误'}`, 'error');
        return false;
      }
    } catch (error) {
      const msg = error.response ? `HTTP ${error.response.status}` : error.message;
      Env.log(`账号 ${this.index} 网络异常: ${msg}`, 'error');
      return false;
    }
  }

  async run() {
    Env.log(`--- 开始执行账号 ${this.index} ---`);
    if (!this.cookie) {
      Env.log(`账号 ${this.index} Cookie无效`, 'error');
      return;
    }
    await this.signIn();
  }
}

async function main() {
  const cookies = Env.getCookies();

  if (cookies.length === 0) {
    Env.log(`未找到环境变量 ${Env.variable}, 请检查配置`, 'error');
    return;
  }

  Env.log(`发现 ${cookies.length} 个账号`);

  for (let i = 0; i < cookies.length; i++) {
    const task = new Chaoxinwen(cookies[i], i);
    await task.run();
  }
}

main()
  .catch((err) => Env.log(`程序运行崩溃: ${err.message}`, 'error'))
  .finally(() => Env.log('全部任务执行完毕'));
