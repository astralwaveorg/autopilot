/**
 * 茅台预约脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   IMAOTAI_MOBILE: 茅台手机号，多个账号用 &、\n 或 @ 分隔
 *   IMAOTAI_TOKEN: 茅台Token，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://www.moutaichina.com/
 */

import { Env } from '../utils';

const $ = new Env('茅台预约', { sep: ['@', '\n', '&'] });

class Imaotai {
  constructor(private config: string, private index: number) {
    const parts = config.split('#');
    this.mobile = parts[0].trim();
    this.token = parts[1].trim();
  }

  async getShopList(): Promise<any[]> {
    try {
      const { data: res } = await $.req.get('https://h5.moutaichina.com/api/shop/list', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.code === 200 && res.data) {
        return res.data.list || [];
      }
      return [];
    } catch (error) {
      $.log(`获取门店列表失败: ${(error as Error).message}`, 'error');
      return [];
    }
  }

  async reserve(shopId: string): Promise<boolean> {
    try {
      const { data: res } = await $.req.post('https://h5.moutaichina.com/api/reserve/create', {
        shopId,
        mobile: this.mobile
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.code === 200) {
        $.log(`账号 ${this.index + 1} 预约成功`, 'info');
        return true;
      } else {
        $.log(`账号 ${this.index + 1} 预约失败: ${res.message || '未知错误'}`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} 预约异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.mobile || !this.token) {
      $.log(`手机号或Token为空`, 'error');
      return;
    }

    const shops = await this.getShopList();
    if (shops.length === 0) {
      $.log(`未获取到门店信息`, 'error');
      return;
    }

    $.log(`获取到 ${shops.length} 家门店`, 'info');

    for (const shop of shops) {
      $.log(`正在预约: ${shop.name}`, 'info');
      await this.reserve(shop.shopId);
    }
  }
}

$.init(Imaotai, 'IMAOTAI_CONFIG')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });