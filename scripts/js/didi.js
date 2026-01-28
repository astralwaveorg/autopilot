/**
 * 滴滴领券 & 滴滴果园自动任务
 * @Author: Astral
 * @Date: 2026-01-28
 * @Version: 1.3.0
 * 环境变量：
 * didi: 格式为 "Didi-Ticket#city_id"，多账号支持分隔符：@ 或 换行 或 &
 * 示例：
 * didi="ticket_value_1#101@ticket_value_2#101"
 */

const $ = new Env('滴滴领券&果园');
const axios = require('axios');
const crypto = require('crypto');

const CONFIG = {
  key: 'didi',
  splitters: ['@', '\n', '&'],
  timeout: 15000,
};

class DidiTask {
  constructor(str, index) {
    const [ticket, cityId] = str.split('#');
    this.index = index + 1;
    this.ticket = ticket?.trim();
    this.city_id = Number(cityId) || 101;
    this.waterNum = 0;
    this.couponsBindList = [];
    this.client = axios.create({
      timeout: CONFIG.timeout,
      headers: {
        'Didi-Ticket': this.ticket,
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      },
    });
  }

  log(msg, level = 'info') {
    const label = level === 'error' ? '[ERROR]' : '[INFO]';
    console.log(`${label} 账号 ${this.index}: ${msg}`);
  }

  async productInit() {
    try {
      const { data: res } = await this.client.post('https://api.didi.cn/webx/v3/productInit', {
        city_id: this.city_id,
        dchn: 'YYPDp7e',
        args: { runtime_args: { 'Didi-Ticket': this.ticket } },
      });

      if (res.errno === 0) {
        const daily = res.data.conf.strategy_data.daily_info.daily_coupon.coupons || [];
        const seckill = res.data.conf.strategy_data.sec_kill_info.seckill || [];

        seckill.forEach((s) => {
          if (s.status === 1) {
            s.coupons
              .filter((c) => c.status === 1)
              .forEach((c) => {
                this.couponsBindList.push({
                  activity_id: c.activity_id,
                  group_id: c.group_id,
                  coupon_conf_id: c.coupon_conf_id,
                });
              });
          }
        });

        daily
          .filter((c) => c.status === 1)
          .forEach((c) => {
            this.couponsBindList.push({
              activity_id: c.activity_id,
              group_id: c.group_id,
              coupon_conf_id: c.coupon_conf_id,
            });
          });
        this.log(`加载待领券: ${this.couponsBindList.length} 张`);
      }
    } catch (e) {
      this.log(`初始化失败: ${e.message}`, 'error');
    }
  }

  async bindCoupon(item) {
    try {
      const { data: res } = await this.client.post(
        'https://ut.xiaojukeji.com/ut/janitor/api/action/coupon/bind',
        {
          ...item,
          city_id: this.city_id,
        }
      );
      if (res.errno === 0) this.log(`领券成功: ${res.data.name}`);
    } catch (e) {}
  }

  async signIn() {
    try {
      const { data: res } = await this.client.post(
        'https://ut.xiaojukeji.com/ut/janitor/api/action/sign/do',
        {}
      );
      if (res.errno === 0) this.log('日常签到成功');
    } catch (e) {
      this.log(`签到异常: ${e.message}`, 'error');
    }
  }

  async orchardTask() {
    try {
      const body = { platform: 1, game_id: 23, token: this.ticket };
      const { data: res } = await this.client.post(
        `https://game.xiaojukeji.com/api/game/plant/newEnter?wsgsig=${this.generateSig(body)}`,
        body
      );

      if (res.errno === 0) {
        this.waterNum = Number(res.data.tree_info.pack_water);
        this.log(`果园状态: 水滴 ${this.waterNum}, 进度 ${res.data.tree_info.tree_progress}%`);

        // 果园签到
        await this.client.post(
          `https://game.xiaojukeji.com/api/game/plant/sign?wsgsig=${this.generateSig(body)}`,
          body
        );

        // 自动浇水 (保留10滴，单次最多浇50次)
        let count = 0;
        while (this.waterNum >= 20 && count < 50) {
          const { data: wRes } = await this.client.post(
            `https://game.xiaojukeji.com/api/game/plant/newWatering?wsgsig=${this.generateSig(body)}`,
            body
          );
          if (wRes.errno === 0) {
            this.waterNum -= 10;
            count++;
          } else break;
        }
        if (count > 0) this.log(`已执行浇水 ${count} 次`);
      }
    } catch (e) {
      this.log(`果园逻辑异常: ${e.message}`, 'error');
    }
  }

  generateSig(obj) {
    const str = JSON.stringify(obj);
    const time = Math.floor(Date.now() / 1000);
    const sig = crypto.createHash('md5').update(`R4doMFFeMNlliIWM${str}`).digest('hex');
    const query = `ts=${time}&v=1&os=web&av=02&kv=0000010001&vl=${Buffer.byteLength(str)}&sig=${sig}`;
    const salt = Math.floor(Math.random() * 4294967296);
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(salt);
    let result = '';
    for (let i = 0; i < query.length; i++) {
      result += String.fromCharCode(buffer[i % 4] ^ query.charCodeAt(i));
    }
    const base64 = Buffer.concat([buffer, Buffer.from(result)])
      .toString('base64')
      .replace(/=+$/, '');
    return `dd03-${base64}`;
  }

  async start() {
    if (!this.ticket) return;
    this.log(`--- 任务开始 ---`);
    await this.productInit();
    await this.signIn();
    for (const item of this.couponsBindList) await this.bindCoupon(item);
    await this.orchardTask();
  }
}

function Env(name) {
  this.name = name;
  this.startTime = Date.now();
  console.log(`\n🔔 ${this.name} 开始执行...\n`);
}

async function main() {
  const rawData = process.env[CONFIG.key] || '';
  if (!rawData) return console.log(`[ERROR] 找不到环境变量: ${CONFIG.key}`);

  const splitter = CONFIG.splitters.find((s) => rawData.includes(s)) || CONFIG.splitters[0];
  const accounts = rawData.split(splitter).filter((v) => v.trim() !== '');

  for (let i = 0; i < accounts.length; i++) {
    const task = new DidiTask(accounts[i], i);
    await task.start();
    if (i < accounts.length - 1) await new Promise((r) => setTimeout(r, 3000));
  }
}

main()
  .catch(console.error)
  .finally(() => {
    console.log(
      `\n🔔 滴滴领券&果园 任务结束 [耗时: ${((Date.now() - $.startTime) / 1000).toFixed(2)}s]`
    );
  });
