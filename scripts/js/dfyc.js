/**
 * 东方云彩自动签到脚本
 * * @Author: Astral
 * @Date: 2026-01-28
 * @Version: 1.0.0
 * * 环境变量：
 * DFYC_COOKIE: 东方云彩Cookie，多账号支持分隔符：@ 或 换行 或 &
 * * 示例：
 * DFYC_COOKIE="session=xxx@session=yyy"
 */

const axios = require('axios');

const CONFIG = {
  key: 'DFYC_COOKIE',
  splitters: ['@', '\n', '&'],
  timeout: 10000,
  baseUrl: 'https://www.dfyc.com/api',
};

class Dfyc {
  constructor(cookie, index) {
    this.cookie = cookie.trim();
    this.index = index + 1;
    this.nickname = '';
    this.client = axios.create({
      baseURL: CONFIG.baseUrl,
      timeout: CONFIG.timeout,
      headers: {
        Cookie: this.cookie,
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      },
    });
  }

  log(msg, level = 'info') {
    const label = level === 'error' ? '[ERROR]' : '[INFO]';
    console.log(`${label} 账号 ${this.index}${this.nickname ? ` [${this.nickname}]` : ''}: ${msg}`);
  }

  async signIn() {
    try {
      const { data: res } = await this.client.get('/user/sign');

      if (res && res.code === 0) {
        this.nickname = res.data?.nickname || '';
        const reward = res.data?.reward;

        if (reward) {
          this.log(`签到成功: 获得 ${reward.name || ''} ${reward.desc || ''}`);
        } else {
          this.log('签到成功: 今日已完成');
        }
        return true;
      } else {
        this.log(`签到失败: ${res?.message || '服务器拒绝访问'}`, 'error');
        return false;
      }
    } catch (error) {
      const msg = error.response ? `HTTP ${error.response.status}` : error.message;
      this.log(`接口访问异常: ${msg}`, 'error');
      return false;
    }
  }

  async run() {
    if (!this.cookie) {
      this.log('环境变量格式错误或Cookie为空', 'error');
      return;
    }
    await this.signIn();
  }
}

async function main() {
  const rawData = process.env[CONFIG.key] || '';
  if (!rawData) {
    console.log(`[ERROR] 未检测到环境变量 ${CONFIG.key}，请在青龙面板中添加。`);
    return;
  }

  const splitter = CONFIG.splitters.find((s) => rawData.includes(s)) || CONFIG.splitters[0];
  const cookies = rawData.split(splitter).filter((t) => t.trim().length > 0);

  console.log(`[INFO] 东方云彩签到任务启动，共检测到 ${cookies.length} 个有效账号\n`);

  for (let i = 0; i < cookies.length; i++) {
    const task = new Dfyc(cookies[i], i);
    await task.run();
  }
}

main()
  .catch((err) => console.error(`[CRITICAL] 脚本崩溃: ${err.message}`))
  .finally(() => console.log('\n[INFO] 所有账号处理完毕'));
