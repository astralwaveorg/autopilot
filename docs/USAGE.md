# AutoPilot 使用指南

## 目录

- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [依赖安装](#依赖安装)
- [脚本使用](#脚本使用)
- [通知配置](#通知配置)
- [常见问题](#常见问题)
- [开发指南](#开发指南)

## 快速开始

### 1. 安装 AutoPilot

在青龙面板中执行以下命令：

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/astralwaveorg/autopilot/main/install.sh)"
```

或者手动添加订阅：

1. 进入青龙面板"订阅管理"
2. 点击"新建订阅"
3. 填写以下信息：
   - 名称：AutoPilot
   - 类型：公开仓库
   - 链接：`https://github.com/astralwaveorg/autopilot.git`
   - 定时规则：`0 0 * * *`
   - 白名单：`scripts`
   - 黑名单：留空
   - 依赖文件：留空
   - 拉取分支：`main`

### 2. 配置环境变量

参考 `configs/env.example` 文件，在青龙面板"环境变量"页面配置所需的环境变量。

### 3. 安装依赖

在青龙面板"依赖管理"中安装：

- **Node.js**：复制 `dependencies/package.json` 中的依赖
- **Python3**：复制 `dependencies/requirements.txt` 中的依赖

### 4. 启用定时任务

参考 `configs/crontab.example` 文件，在青龙面板"定时任务"中启用需要的脚本。

## 环境配置

### 环境变量说明

所有环境变量都在 `configs/env.example` 文件中有详细说明，主要分为以下几类：

#### 1. 通知配置

- `NOTIFY_TYPE`：通知策略（0-禁用, 1-仅异常, 2-全通知）
- `PUSH_PLUS_TOKEN`：PushPlus 推送令牌
- `TG_BOT_TOKEN`：Telegram 机器人令牌
- `TG_USER_ID`：Telegram 用户ID
- 其他通知方式详见 `configs/env.example`

#### 2. 脚本特定配置

每个脚本都有对应的环境变量，例如：

- `JD_COOKIE`：京东 Cookie
- `ALYP`：阿里云盘 Token
- `XMLY_COOKIE`：喜马拉雅 Cookie

#### 3. 通用配置

- `LOG_LEVEL`：日志级别（debug, info, warn, error）
- `REQUEST_TIMEOUT`：请求超时时间（秒）
- `HTTP_PROXY`：HTTP 代理地址
- `HTTPS_PROXY`：HTTPS 代理地址

### 多账号配置

所有脚本都支持多账号，使用以下分隔符之一：

- `&`：`token1&token2&token3`
- `\n`：每个账号一行
- `@`：`token1@token2@token3`

示例：

```bash
JD_COOKIE=pt_key=xxx1;pt_pin=user1&pt_key=xxx2;pt_pin=user2&pt_key=xxx3;pt_pin=user3
```

### 多变量配置

部分脚本支持多变量，使用 `#` 分隔：

```bash
VARIABLE_NAME=value1#value2#value3
```

## 依赖安装

### Node.js 依赖

1. 进入青龙面板"依赖管理"
2. 选择"NodeJs"
3. 点击"新建依赖"
4. 依赖类型：`package.json`
5. 复制 `dependencies/package.json` 的内容
6. 点击"确定"

### Python3 依赖

1. 进入青龙面板"依赖管理"
2. 选择"Python3"
3. 点击"新建依赖"
4. 依赖类型：`requirements.txt`
5. 复制 `dependencies/requirements.txt` 的内容
6. 点击"确定"

### 自动安装

也可以通过以下命令自动安装：

```bash
# 安装 Node.js 依赖
cd /ql/scripts/autopilot && npm install

# 安装 Python 依赖
pip3 install -r dependencies/requirements.txt
```

## 脚本使用

### 签到类脚本

签到类脚本位于 `scripts/checkin/` 目录，包括各类APP、小程序、网站的自动签到脚本。

使用方法：

1. 配置对应的环境变量
2. 启用对应的定时任务
3. 等待执行或手动运行

### 信息推送类脚本

信息推送类脚本位于 `scripts/info/` 目录，包括：

- `daily_news.ts`：60s 早报推送
- `weather_report.ts`：天气预报推送

使用方法：

1. 配置对应的环境变量
2. 启用对应的定时任务
3. 等待执行或手动运行

### 工具类脚本

工具类脚本位于 `scripts/tools/` 目录，包括：

- `disable_duplicate.ts`：禁用重复脚本
- `alipan_clean.ts`：阿里云盘小雅挂载清理
- `modify_notify.js`：修改通知配置
- 更多工具持续添加中...

使用方法：

1. 配置对应的环境变量（如需要）
2. 启用对应的定时任务
3. 等待执行或手动运行

### 手动运行脚本

在青龙面板"定时任务"中：

1. 找到对应的脚本
2. 点击"运行"
3. 查看日志输出

或者在 SSH 中运行：

```bash
cd /ql/scripts/autopilot
node scripts/checkin/aliyun_drive.js
```

## 通知配置

### 通知策略

通过环境变量 `NOTIFY_TYPE` 控制通知策略：

- `0`：禁用所有通知
- `1`：仅在出现错误时通知（推荐）
- `2`：发送所有通知

### 支持的通知方式

AutoPilot 支持 20+ 种通知方式，详见 `configs/env.example` 文件。

#### PushPlus（推荐）

1. 访问 [PushPlus 官网](https://www.pushplus.plus/)
2. 注册并登录
3. 获取 Token
4. 配置环境变量：
   ```bash
   PUSH_PLUS_TOKEN=your_token
   ```

#### Telegram

1. 在 Telegram 中找到 @BotFather
2. 创建机器人，获取 Token
3. 找到 @userinfobot，获取用户ID
4. 配置环境变量：
   ```bash
   TG_BOT_TOKEN=your_bot_token
   TG_USER_ID=your_user_id
   ```

#### Server 酱

1. 访问 [Server 酱官网](https://sct.ftqq.com/)
2. 注册并登录
3. 获取 SendKey
4. 配置环境变量：
   ```bash
   PUSH_KEY=your_sendkey
   ```

#### 其他通知方式

详见 `configs/env.example` 文件。

### 通知内容

通知内容包括：

- 脚本名称
- 执行时间
- 执行结果
- 错误信息（如有）

示例：

```
【示例签到】
2025-01-27 08:00:00

========== 账号 1 ==========
用户: testuser
签到成功，获得 10 积分，连续签到 5 天
领取奖励成功: 签到礼包
账号 1 执行完成

========== 账号 2 ==========
Token 为空

执行总结
==================================================
成功: 3
失败: 1
警告: 0
==================================================
```

## 常见问题

### 1. 脚本运行失败怎么办？

**检查步骤：**

1. 查看日志，确认错误信息
2. 检查环境变量是否正确配置
3. 检查依赖是否安装
4. 检查网络连接是否正常
5. 查看脚本是否需要更新

**常见错误：**

- `未找到环境变量 XXX`：检查环境变量名称是否正确
- `请求失败`：检查网络连接和代理设置
- `Token 失效`：更新对应的 Token 或 Cookie

### 2. 如何添加新脚本？

参考 `scripts/templates/` 目录下的模板文件，按照以下步骤：

1. 复制模板文件
2. 修改脚本名称和功能
3. 实现业务逻辑
4. 添加环境变量说明到 `configs/env.example`
5. 测试脚本
6. 提交到仓库

详细开发指南请参考 [开发指南](#开发指南)。

### 3. 如何禁用某个账号？

有两种方式：

**方式一：修改环境变量**

删除或注释掉对应的账号配置。

**方式二：使用青龙 API**

```javascript
const { QLAPI } = require('./utils/ql');
const ql = new QLAPI();

// 禁用环境变量
await ql.disableEnv(['env_id']);
```

### 4. 如何查看执行日志？

在青龙面板中：

1. 进入"定时任务"
2. 找到对应的脚本
3. 点击"日志"
4. 查看执行日志

或者在 SSH 中：

```bash
# 查看最近的日志
tail -f /ql/log/*.log

# 查看特定脚本的日志
grep "脚本名称" /ql/log/*.log
```

### 5. 如何更新脚本？

**方式一：自动更新**

如果设置了定时拉取订阅，脚本会自动更新。

**方式二：手动更新**

```bash
ql repo https://github.com/astralwaveorg/autopilot.git "scripts" "" "" "main"
```

### 6. 如何备份配置？

备份以下内容：

1. 环境变量：在青龙面板"环境变量"中导出
2. 自定义配置：备份 `configs/` 目录
3. 自定义脚本：备份 `scripts/` 目录

### 7. 如何贡献代码？

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 开启 Pull Request

详见 [README.md](../README.md) 中的"参与贡献"部分。

## 开发指南

### 脚本模板

#### JavaScript 模板

```javascript
/*
 * @Author: Astral
 * @Date: 2025-01-27
 * @Description: 脚本功能描述
 * @cron: 30 7 * * *
 * @new Env('脚本名称')
 * @环境变量: ENV_VAR_NAME 变量说明
 */

const { Env } = require('./utils/Env.js');

const $ = new Env('脚本名称', { sep: ['@', '\n', '&'] });

class Task {
  constructor(config, index) {
    this.config = config;
    this.index = index;
  }

  async start() {
    try {
      $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

      // 业务逻辑
      await this.main();

      $.log(`账号 ${this.index + 1} 执行完成`, 'info');
    } catch (error) {
      $.log(`账号 ${this.index + 1} 执行失败: ${error.message}`, 'error');
    }
  }

  async main() {
    // 实现业务逻辑
  }
}

$.init(Task, 'ENV_VAR_NAME')
  .catch(error => {
    $.log(`程序执行失败: ${error.message}`, 'error');
  })
  .finally(() => {
    $.done();
  });
```

#### TypeScript 模板

```typescript
/*
 * @Author: Astral
 * @Date: 2025-01-27
 * @Description: 脚本功能描述
 * @cron: 30 7 * * *
 * @new Env('脚本名称')
 * @环境变量: ENV_VAR_NAME 变量说明
 */

import { Env } from '../utils';

const $ = new Env('脚本名称', { sep: ['@', '\n', '&'] });

class Task {
  constructor(private config: string, private index: number) {}

  async start(): Promise<void> {
    try {
      $.log(`\n========== 账号 ${this.index + 1} ==========`, 'info');

      // 业务逻辑
      await this.main();

      $.log(`账号 ${this.index + 1} 执行完成`, 'info');
    } catch (error) {
      $.log(`账号 ${this.index + 1} 执行失败: ${(error as Error).message}`, 'error');
    }
  }

  private async main(): Promise<void> {
    // 实现业务逻辑
  }
}

$.init(Task, 'ENV_VAR_NAME')
  .catch(error => {
    $.log(`程序执行失败: ${(error as Error).message}`, 'error');
  })
  .finally(() => {
    $.done();
  });
```

### Env 类 API

#### 构造函数

```javascript
new Env(name, options)
```

参数：
- `name`：脚本名称
- `options`：配置选项
  - `sep`：账号分隔符（默认：`['&', '\n', '@']`）
  - `notifyType`：通知策略（默认：`1`）
  - `logLevel`：日志级别（默认：`'info'`）

#### 方法

##### init

初始化并执行任务。

```javascript
await $.init(TaskClass, envName)
```

参数：
- `TaskClass`：任务类
- `envName`：环境变量名称

##### log

记录日志。

```javascript
$.log(msg, level)
```

参数：
- `msg`：日志消息
- `level`：日志级别（`debug`, `info`, `warn`, `error`）

##### request

HTTP 请求。

```javascript
await $.request(config)
```

参数：
- `config`：Axios 请求配置

##### get

GET 请求。

```javascript
await $.get(url, config)
```

##### post

POST 请求。

```javascript
await $.post(url, data, config)
```

##### put

PUT 请求。

```javascript
await $.put(url, data, config)
```

##### delete

DELETE 请求。

```javascript
await $.delete(url, config)
```

##### getStorage

获取持久化存储。

```javascript
const storage = $.getStorage(name);
await storage.setItem(key, value);
const value = await storage.getItem(key);
await storage.removeItem(key);
```

##### done

完成任务并发送通知。

```javascript
await $.done()
```

### 工具函数

详见 `scripts/utils/common.ts` 文件，主要包括：

- 字符串生成：`randomString`, `randomInt`, `uuid`, `guid`
- 数据脱敏：`maskPhone`, `maskEmail`
- 时间处理：`timestamp`, `timestampToDate`, `currentDate`
- 加密解密：`md5`, `sha1`, `sha256`, `base64Encode`
- 数据验证：`isEmpty`, `isJson`
- 数组操作：`unique`, `groupBy`, `sortBy`, `shuffle`
- HTTP 请求：`httpGet`, `httpPost`, `httpPut`, `httpDelete`

### 测试

运行测试：

```bash
npm test
```

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 添加必要的注释和文档
- 编写单元测试

运行代码检查：

```bash
npm run lint
```

格式化代码：

```bash
npm run format
```

## 更多信息

- GitHub: https://github.com/astralwaveorg/autopilot
- 文档: https://github.com/astralwaveorg/autopilot/blob/main/README.md
- 问题反馈: https://github.com/astralwaveorg/autopilot/issues

## 许可证

MIT License
