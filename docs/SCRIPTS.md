# AutoPilot 脚本使用说明

## 脚本分类

AutoPilot 项目包含 110 个自动化脚本，按功能分为以下 8 大类：

### 1. 签到类 (checkin) - 84 个脚本

各类 APP、小程序、网站的自动签到脚本。

#### JavaScript (55 个)
- `aliyun_drive.js` - 阿里云盘签到
- `qibida.js` - Q必达签到
- `meishu.js` - 美数签到
- `bhxcy.js` - BHXCY签到
- `wnn.js` - WNN签到
- `sfsy.js` - SFSY签到
- `dt.js` - DT签到
- `liyingyunjie.js` - 利赢云杰签到
- `xipigou.js` - 西皮狗签到
- `xiaosatonglu.js` - 小沙通路签到
- `shangshaban.js` - 上上班签到
- `libai_vip.js` - 立白VIP签到
- `hqcsh.js` - 华清生活签到
- `zhiwuxingqiu.js` - 植物星球签到
- `yyq.js` - YYQ签到
- `ljfsjlb.js` - 龙江健身签到
- `gqaa.js` - GQAA签到
- `sysxc.js` - 实现签到
- `shangzhan_wangluo.js` - 商展网络签到
- `jingcaizhaopin.js` - 精彩招聘签到
- `ksjsb.js` - 快捷记账签到
- `yuebai.js` - 月白签到
- `jlqc.js` - 金龙汽车签到
- `haitianmeiweiguan.js` - 海天美味馆签到
- `quzanmi.js` - 去赞米签到
- `mtf.js` - MTF签到
- `shangzhanwangluo.js` - 商展网络签到
- `didi.js` - 滴滴签到
- `hfzj.js` - 杭州智驾签到
- `musi.js` - 慕思签到
- `jlzx.js` - 金龙智选签到
- `xqz.js` - 小智签到
- `gqftbz.js` - 共青体签到
- `chaoxinwen.js` - 潮新闻签到
- `dffx.js` - 东方飞讯签到
- `sytt.js` - 商通通签到
- `lenovoapp.js` - 联想签到
- `gjzp.js` - 国际招聘签到
- `maisiweier.js` - 麦斯韦尔签到
- `xinxi.js` - 信息签到
- `qtx.js` - QTX签到
- `dfyc.js` - 东方云彩签到
- `hl.js` - HL签到
- `ftej.js` - 飞特签到
- `dw.js` - 达维签到
- `htx.js` - 火币签到
- `yinxiang.js` - 印象签到
- `fenxiang.js` - 分享签到
- `qbd.js` - QBD签到
- `fsdlb.js` - 飞速登录签到

#### Python (11 个)
- `aliyun_drive.py` - 阿里云盘签到
- `qidianwu_water.py` - 七点五签到
- `iqiyi.py` - 爱奇艺签到
- `dydd.py` - 大豆签到
- `changhongmeiling.py` - 长虹美菱签到
- `enshan.py` - 恩山签到
- `bjxd.py` - 北京现代签到
- `quanzhan.py` - 全站签到
- `yidongyunpan.py` - 移动云盘签到
- `7dian5.py` - 七点五签到
- `maomao_kankan.py` - 猫猫看看签到

#### TypeScript (18 个)
- `aliyun_drive.ts` - 阿里云盘签到
- `meituan.ts` - 美团签到
- `iqiyi.ts` - 爱奇艺签到
- `identical.ts` - 相同签到
- `huluwa.ts` - 葫芦娃签到
- `hl.ts` - HL签到
- `aima.ts` - 爱码签到
- `ipzan.ts` - IP赞签到
- `videoqq.ts` - 腾讯视频签到
- `ths.ts` - THS签到
- `aicnn.ts` - AICNN签到
- `jsbaxfls.ts` - JSBAXFLS签到
- `imaotai.ts` - 茅台签到
- `yourapi.ts` - YourAPI签到
- `ssone.ts` - SSOne签到
- `ikuuu.ts` - ikuuu签到
- `newapi.ts` - NewAPI签到

### 2. 信息类 (info) - 4 个脚本

各类信息推送脚本，如天气、新闻等。

#### TypeScript (4 个)
- `daily_news.ts` - 60s 读懂世界早报
- `weather_report.ts` - 每日天气预报

### 3. 工具类 (tools) - 14 个脚本

系统管理、清理、优化等工具脚本。

#### JavaScript (8 个)
- `modify_notify.js` - 修改通知配置
- `migrate_scripts.js` - 脚本批量迁移工具
- `notify_interceptor.js` - 青龙通知拦截
- `clean_emoji.py` - 清理emoji符号
- `refactor_scripts.js` - 脚本批量重构工具

#### TypeScript (5 个)
- `install_whistle.ts` - 安装Whistle代理
- `alipan_clean.ts` - 阿里云盘清理
- `disable_duplicate.ts` - 禁用青龙重复脚本

#### Python (1 个)
- `clean_emoji.py` - 清理emoji符号

### 4. 购物类 (shopping) - 3 个脚本

电商平台相关脚本。

#### JavaScript (3 个)
- `meituan.js` - 美团签到
- `piaopiaochaoshi.js` - 飘飘超市签到
- `mxbc.js` - 美币城签到

### 5. 汽车类 (car) - 0 个脚本

汽车品牌相关脚本（暂无）。

### 6. 生活类 (life) - 5 个脚本

生活服务相关脚本。

#### JavaScript (4 个)
- `hyjk.js` - 健康卡签到
- `ddsy_songyao.js` - 叮当送药签到
- `huangli.js` - 黄历查询

#### Python (1 个)
- `dingdang_kuaiyao.py` - 叮当快药签到

### 7. 金融类 (finance) - 4 个脚本

银行、支付等金融相关脚本。

#### JavaScript (4 个)
- `unionpay.js` - 云闪付签到
- `dianxin.js` - 电信签到
- `jlyh.js` - 吉林银行签到
- `nhsy.js` - 农商银行签到

### 8. 媒体类 (media) - 7 个脚本

视频、阅读、游戏等娱乐相关脚本。

#### JavaScript (4 个)
- `yingsheng_v2.js` - 影声签到
- `bucket.js` - 桶签到
- `baitianGame.js` - 百天游戏签到

#### Python (1 个)
- `iqiyi.py` - 爱奇艺签到

#### TypeScript (2 个)
- `ximalaya.ts` - 喜马拉雅签到

## 脚本使用说明

### 环境变量配置

每个脚本都有对应的环境变量，主要分为以下几类：

#### 1. Token/Cookie 类
大多数签到脚本需要 Token 或 Cookie，格式如下：

```bash
# 单账号
SCRIPT_TOKEN=your_token_here

# 多账号（使用 & 分隔）
SCRIPT_TOKEN=token1&token2&token3

# 多账号（使用换行分隔）
SCRIPT_TOKEN=token1
token2
token3

# 多账号（使用 @ 分隔）
SCRIPT_TOKEN=token1@token2@token3
```

#### 2. 账号密码类
部分脚本使用账号密码：

```bash
# 格式：用户名:密码
SCRIPT_CREDENTIAL=username:password

# 多账号
SCRIPT_CREDENTIAL=user1:pass1&user2:pass2
```

#### 3. JSON 配置类
部分脚本使用 JSON 格式配置：

```bash
SCRIPT_CONFIG={"key1":"value1","key2":"value2"}
```

### 获取 Token/Cookie 的方法

#### 1. 浏览器开发者工具（Chrome/Edge）
1. 按 F12 打开开发者工具
2. 切换到 "Network" 标签
3. 刷新页面或执行相关操作
4. 找到对应的请求
5. 查看 "Headers" 中的 "Cookie" 或 "Authorization" 字段

#### 2. 抓包工具
使用 Fiddler、Charles、Whistle 等抓包工具获取请求信息。

#### 3. 移动端抓包
使用 HTTPCanary、Packet Capture 等移动端抓包工具。

### 常见问题

#### 1. Token/Cookie 失效
- 重新获取 Token/Cookie
- 检查是否需要重新登录
- 部分网站 Token 有效期较短，需要定期更新

#### 2. 签到失败
- 检查 Token/Cookie 是否正确
- 检查网络连接
- 查看日志中的错误信息
- 部分网站有反爬虫机制，可能需要等待

#### 3. 多账号配置错误
- 确保分隔符使用正确（&、\n 或 @）
- 检查每个账号的格式是否正确
- 避免多余的空格或换行

## 脚本开发

### 添加新脚本
1. 阅读开发指南：`docs/DEVELOPMENT.md`
2. 使用模板文件：`scripts/templates/`
3. 遵循代码规范
4. 添加环境变量说明
5. 测试验证

### 脚本模板
参考 `scripts/templates/` 目录下的模板文件。

## 更多信息

- GitHub: https://github.com/astralwaveorg/autopilot
- 使用文档: [USAGE.md](./USAGE.md)
- 开发指南: [DEVELOPMENT.md](./DEVELOPMENT.md)
- 问题反馈: https://github.com/astralwaveorg/autopilot/issues

## 许可证

MIT License