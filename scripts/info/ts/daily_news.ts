/**
 * 每日60s早报推送脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   DAILY_NEWS_API: 60s API地址，默认为 https://60s.lzw.me
 *   DAILY_NEWS_TYPE: 订阅类型，多个用逗号分隔，可选：60s, bili, weibo, zhihu, toutiao, douyin, history
 *
 * 参考文档: https://github.com/lzwme/60s-php
 */

import { Env } from '../utils';

const $ = new Env('每日60s早报');

const NEWS_TYPES = {
  '60s': '60s读懂世界',
  bili: 'B站热搜',
  weibo: '微博热搜',
  zhihu: '知乎热榜',
  toutiao: '头条热搜',
  douyin: '抖音热搜',
  history: '历史上的今天'
};

class DailyNews {
  async getNews(type: string): Promise<string> {
    try {
      const api = process.env.DAILY_NEWS_API || 'https://60s.lzw.me';
      const { data: res } = await $.req.get(`${api}?type=${type}`);

      if (res.news && res.news.length > 0) {
        const title = NEWS_TYPES[type as keyof typeof NEWS_TYPES];
        const newsList = res.news.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n');
        const message = `${newsList}\n\n[${res.date}]${res.tip}`;

        $.log(`[${title}] 推送成功`, 'info');
        return `[${title}]\n${message}`;
      } else {
        $.log(`[${type}] 获取新闻失败`, 'error');
        return '';
      }
    } catch (error) {
      $.log(`[${type}] 获取新闻异常: ${(error as Error).message}`, 'error');
      return '';
    }
  }

  async start(): Promise<void> {
    const types = (process.env.DAILY_NEWS_TYPE || '60s').split(',').map(t => t.trim());

    for (const type of types) {
      if (NEWS_TYPES[type as keyof typeof NEWS_TYPES]) {
        const message = await this.getNews(type);
        if (message) {
          $.msgs.push(message);
        }
      }
    }
  }
}

$.init(DailyNews, 'DUMMY')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });