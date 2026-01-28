/**
 * 修改通知脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   NOTIFY_TYPE: 通知类型，支持 pushplus、telegram、dingtalk 等
 *   NOTIFY_CONFIG: 通知配置，JSON格式
 *
 * 参考文档: https://github.com/whyour/qinglong
 */

const { Env } = require('../../utils');

const $ = new Env('修改通知', { sep: ['@', '\n', '&'] });

class ModifySendNotify {
  constructor(private config: string, private index: number) {
    const parts = config.split('#');
    this.notifyType = parts[0].trim();
    this.notifyConfig = parts.length > 1 ? JSON.parse(parts[1].trim()) : {};
  }

  async modify(): Promise<boolean> {
    try {
      const notifyPath = require.resolve('../../utils/sendNotify');
      const notifyContent = require('fs').readFileSync(notifyPath, 'utf-8');

      let modified = false;

      switch (this.notifyType) {
        case 'pushplus':
          if (this.notifyConfig.token) {
            const pushplusRegex = /PUSHPLUS_TOKEN\s*=\s*['"]([^"]*)['"]/;
            const newPushplus = `PUSHPLUS_TOKEN = '${this.notifyConfig.token}'`;
            if (notifyContent.match(pushplusRegex)) {
              const newContent = notifyContent.replace(pushplusRegex, newPushplus);
              require('fs').writeFileSync(notifyPath, newContent);
              modified = true;
            }
          }
          break;

        case 'telegram':
          if (this.notifyConfig.botToken && this.notifyConfig.userId) {
            const telegramRegex = /TELEGRAM_BOT_TOKEN\s*=\s*['"]([^"]*)['"]/;
            const newTelegram = `TELEGRAM_BOT_TOKEN = '${this.notifyConfig.botToken}'`;
            if (notifyContent.match(telegramRegex)) {
              const newContent = notifyContent.replace(telegramRegex, newTelegram);
              require('fs').writeFileSync(notifyPath, newContent);
              modified = true;
            }

            const userIdRegex = /TELEGRAM_USER_ID\s*=\s*['"]([^"]*)['"]/;
            const newUserId = `TELEGRAM_USER_ID = '${this.notifyConfig.userId}'`;
            if (notifyContent.match(userIdRegex)) {
              const newContent = notifyContent.replace(userIdRegex, newUserId);
              require('fs').writeFileSync(notifyPath, newContent);
              modified = true;
            }
          }
          break;

        case 'dingtalk':
          if (this.notifyConfig.token && this.notifyConfig.secret) {
            const dingtalkRegex = /DINGTALK_TOKEN\s*=\s*['"]([^"]*)['"]/;
            const newDingtalk = `DINGTALK_TOKEN = '${this.notifyConfig.token}'`;
            if (notifyContent.match(dingtalkRegex)) {
              const newContent = notifyContent.replace(dingtalkRegex, newDingtalk);
              require('fs').writeFileSync(notifyPath, newContent);
              modified = true;
            }

            const secretRegex = /DINGTALK_SECRET\s*=\s*['"]([^"]*)['"]/;
            const newSecret = `DINGTALK_SECRET = '${this.notifyConfig.secret}'`;
            if (notifyContent.match(secretRegex)) {
              const newContent = notifyContent.replace(secretRegex, newSecret);
              require('fs').writeFileSync(notifyPath, newContent);
              modified = true;
            }
          }
          break;

        default:
          $.log(`不支持的通知类型: ${this.notifyType}`, 'error');
          return false;
      }

      if (modified) {
        $.log(`账号 ${this.index + 1} 通知配置修改成功`, 'info');
        return true;
      } else {
        $.log(`账号 ${this.index + 1} 通知配置修改失败`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} 通知配置修改异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.notifyType) {
      $.log(`通知类型为空`, 'error');
      return;
    }

    await this.modify();
  }
}

$.init(ModifySendNotify, 'NOTIFY_CONFIG')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });