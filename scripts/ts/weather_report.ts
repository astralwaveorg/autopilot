/**
 * 天气预报推送脚本
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * 环境变量:
 *   WEATHER_CITY_CODE: 城市代码，可访问 https://fastly.jsdelivr.net/gh/Oreomeow/checkinpanel@master/city.json 查找
 *   北京: 101010100
 *   广州: 101280101
 *   上海: 101020100
 *
 * 参考文档: https://www.sojson.com/api/weather.html
 */

import { Env } from '../utils';

const $ = new Env('每日天气预报');

class WeatherReport {
  async getWeather(cityCode: string): Promise<string> {
    try {
      const { data: res } = await $.req.get(`http://t.weather.itboy.net/api/weather/city/${cityCode}`);

      if (res.status === 200 && res.data) {
        const cityInfo = res.data.cityInfo;
        const today = res.data.forecast[0];
        const forecast = res.data.forecast;

        const message = [
          `城市: ${cityInfo.city}`,
          `日期: ${today.ymd} ${today.week}`,
          `天气: ${today.type}`,
          `温度: ${today.high} ${today.low}`,
          `湿度: ${res.data.shidu}`,
          `空气质量: ${res.data.quality}`,
          `PM2.5: ${res.data.pm25}`,
          `PM10: ${res.data.pm10}`,
          `风力风向: ${today.fx} ${today.fl}`,
          `感冒指数: ${res.data.ganmao}`,
          `温馨提示: ${today.notice}`,
          `更新时间: ${res.time}`
        ].join('\n');

        const forecastText = forecast.map((day: any) => [
          day.ymd.replace(/-/g, '').slice(4),
          day.week.replace('星期', ''),
          `${day.low.replace('低温 ', '')}~${day.high.replace('高温 ', '')}`,
          day.type
        ].join(' ')).join('\n');

        $.log(`${cityInfo.city} 天气获取成功`, 'info');
        return `${cityInfo.cityInfo.city}今日天气\n\n${message}\n\n${forecastText}`;
      } else {
        $.log(`天气获取失败`, 'error');
        return '';
      }
    } catch (error) {
      $.log(`天气获取异常: ${(error as Error).message}`, 'error');
      return '';
    }
  }

  async start(): Promise<void> {
    const cityCode = process.env.WEATHER_CITY_CODE || '';

    if (!cityCode) {
      $.log('未配置环境变量 WEATHER_CITY_CODE', 'warn');
      $.log('请访问 https://fastly.jsdelivr.net/gh/Oreomeow/checkinpanel@master/city.json 查找城市代码', 'info');
      return;
    }

    const message = await this.getWeather(cityCode);
    if (message) {
      $.msgs.push(message);
    }
  }
}

$.init(WeatherReport, 'DUMMY')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
    console.error(error);
  })
  .finally(() => {
    $.done();
  });