/**
 * yourapi签到脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   YOURAPI_URL: yourapi地址，多个账号用 &、\n 或 @ 分隔
 *   YOURAPI_COOKIE: yourapi Cookie，多个账号用 &、\n 或 @ 分隔
 *
 * 参考文档: https://yourapi.com/
 */

import { Env } from '../utils';

const $ = new Env('yourapi签到', { sep: ['@', '\n', '&'] });

class YourAPI {
  constructor(private config: string, private index: number) {
    const parts = config.split('#');
    this.url = parts[0].trim();
    this.cookie = parts[1].trim();
    this.siteName = parts.length > 2 ? parts[2].trim() : `站点${this.index + 1}`;
  }

  async checkCaptcha(): Promise<string> {
    try {
      const { data: res } = await $.req.get(`${this.url}/api/captcha`, {
        headers: {
          'Cookie': this.cookie,
          'Content-Type': 'application/json'
        }
      });

      if (res.data && res.data.captchaId) {
        return res.data.captchaId;
      }
      return '';
    } catch (error) {
      $.log(`获取验证码失败: ${(error as Error).message}`, 'warn');
      return '';
    }
  }

  async recognizeCaptcha(captchaId: string): Promise<string> {
    try {
      const captchaData = await $.req.get(`${this.url}/api/captcha/image?id=${captchaId}`, {
        headers: {
          'Cookie': this.cookie
        }
      });

      if (captchaData) {
        const captchaImage = captchaData.data || captchaData;

        // 优先使用dddocr识别
        try {
          const { data: dddocrRes } = await $.req.post('http://127.0.0.1:6666/recognize', {
            image: captchaImage
          });
          if (dddocrRes && dddocrRes.data) {
            return dddocrRes.data;
          }
        } catch (error) {
          // dddocr失败，使用百度OCR
          const { data: baiduRes } = await $.req.post('https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic', {
            image: captchaImage
          });
          if (baiduRes && baiduRes.words && baiduRes.words[0]) {
            return baiduWords[0];
          }
        }
      }

      return '';
    } catch (error) {
      $.log(`验证码识别失败: ${(error as Error).message}`, 'warn');
      return '';
    }
  }

  async signIn(): Promise<boolean> {
    try {
      const captchaId = await this.checkCaptcha();
      const captcha = captchaId ? await this.recognizeCaptcha(captchaId) : '';

      const { data: res } = await $.req.post(`${this.url}/api/user/checkin`, {
        captchaId,
        captcha
      }, {
        headers: {
          'Cookie': this.cookie,
          'Content-Type': 'application/json'
        }
      });

      if (res.success) {
        const balance = res.data?.balance || '未知';
        $.log(`账号 ${this.index + 1} [${this.siteName}] 签到成功`, 'info');
        $.log(`   余额: ${balance}`, 'info');
        return true;
      } else {
        $.log(`账号 ${this.index + 1} [${this.siteName}] 签到失败: ${res.msg || '未知错误'}`, 'error');
        return false;
      }
    } catch (error) {
      $.log(`账号 ${this.index + 1} [${this.siteName}] 签到异常: ${(error as Error).message}`, 'error');
      return false;
    }
  }

  async start(): Promise<void> {
    $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

    if (!this.url || !this.cookie) {
      $.log(`URL或Cookie为空`, 'error');
      return;
    }

    await this.signIn();
  }
}

$.init(YourAPI, 'YOURAPI_CONFIG')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });