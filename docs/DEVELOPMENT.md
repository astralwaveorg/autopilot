# AutoPilot 开发指南

## 目录

- [项目架构](#项目架构)
- [开发环境搭建](#开发环境搭建)
- [代码规范](#代码规范)
- [脚本开发](#脚本开发)
- [测试](#测试)
- [发布流程](#发布流程)

## 项目架构

### 目录结构

```
autopilot/
├── scripts/                 # 主脚本目录
│   ├── utils/              # 核心工具模块
│   │   ├── Env.ts          # 环境管理类
│   │   ├── common.ts       # 通用工具函数
│   │   ├── ql.ts           # 青龙API封装
│   │   └── sendNotify.js   # 统一通知模块
│   ├── js/                 # JavaScript脚本
│   ├── python/             # Python脚本
│   ├── shell/              # Shell脚本
│   ├── ts/                 # TypeScript脚本
│   └── storage/            # 持久化存储
├── configs/                # 配置文件
│   ├── env.example         # 环境变量示例
│   └── crontab.example     # 定时任务示例
├── dependencies/           # 依赖管理
│   ├── package.json        # Node.js依赖
│   └── requirements.txt    # Python依赖
├── tests/                  # 测试文件
├── docs/                   # 文档
└── install.sh             # 一键安装脚本
```

### 核心模块

#### Env 类

环境管理类，提供统一的运行环境封装。

**主要功能：**
- 多账号管理
- 日志记录
- 消息收集
- 通知发送
- 持久化存储

**使用示例：**

```javascript
const { Env } = require('./utils/Env.js');

const $ = new Env('脚本名称', {
  sep: ['@', '\n', '&'],
  notifyType: 1,
  logLevel: 'info'
});

class Task {
  constructor(config, index) {
    this.config = config;
    this.index = index;
  }

  async start() {
    // 业务逻辑
  }
}

$.init(Task, 'ENV_VAR_NAME').then(() => $.done());
```

#### common.ts

通用工具函数库，提供各种常用的工具函数。

**主要功能：**
- 字符串生成
- 数据脱敏
- 时间处理
- 加密解密
- 数据验证
- 数组操作
- HTTP 请求

**使用示例：**

```typescript
import { randomString, md5, timestamp } from '../utils/common';

const str = randomString(10);
const hash = md5('hello');
const ts = timestamp();
```

#### ql.ts

青龙 API 封装，提供青龙面板 API 的封装。

**主要功能：**
- 环境变量管理
- 任务管理
- 系统信息获取

**使用示例：**

```javascript
const { QLAPI } = require('./utils/ql');
const ql = new QLAPI();

// 获取环境变量
const envs = await ql.getEnvs();

// 添加环境变量
await ql.addEnv('name', 'value', 'remarks');
```

## 开发环境搭建

### 前置要求

- Node.js >= 16.0.0
- Python >= 3.8
- Git

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/astralwaveorg/autopilot.git
cd autopilot

# 安装 Node.js 依赖
npm install

# 安装 Python 依赖
pip3 install -r dependencies/requirements.txt
```

### 开发工具推荐

- **IDE**：VS Code
- **插件**：
  - ESLint
  - Prettier
  - TypeScript
  - Jest

### 配置 VS Code

在项目根目录创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 代码规范

### 命名规范

#### 文件命名

- JavaScript/TypeScript：使用小写字母和下划线
  - `example_signin.js`
  - `task_template.ts`
- Python：使用小写字母和下划线
  - `example_signin.py`

#### 变量命名

- 常量：使用大写字母和下划线
  ```javascript
  const MAX_RETRY = 3;
  ```
- 变量：使用驼峰命名法
  ```javascript
  const userName = 'test';
  ```
- 类名：使用帕斯卡命名法
  ```javascript
  class SignInTask {}
  ```

#### 函数命名

使用驼峰命名法，动词开头：

```javascript
function getUserInfo() {}
async function signIn() {}
```

### 注释规范

#### 文件头注释

```javascript
/*
 * @Author: Astral
 * @Date: 2025-01-27
 * @LastEditors: Astral
 * @LastEditTime: 2025-01-27
 * @Description: 脚本功能描述
 * @cron: 30 7 * * *
 * @new Env('脚本名称')
 * @环境变量: ENV_VAR_NAME 变量说明
 */
```

#### 函数注释

```javascript
/**
 * 获取用户信息
 * @param {string} token - 用户Token
 * @returns {Promise<Object>} 用户信息
 */
async function getUserInfo(token) {
  // 实现
}
```

#### 行内注释

```javascript
// 检查Token是否有效
if (!token) {
  throw new Error('Token为空');
}
```

### 代码格式化

使用 Prettier 进行代码格式化：

```bash
npm run format
```

### 代码检查

使用 ESLint 进行代码检查：

```bash
npm run lint
```

## 脚本开发

### 开发流程

1. **需求分析**
   - 明确脚本功能
   - 确定需要的API
   - 分析数据格式

2. **创建脚本**
   - 复制模板文件
   - 修改脚本名称
   - 实现业务逻辑

3. **测试脚本**
   - 编写单元测试
   - 手动测试
   - 多账号测试

4. **文档编写**
   - 添加环境变量说明
   - 编写使用说明
   - 更新 README

5. **提交代码**
   - 代码审查
   - 合并到主分支

### 脚本模板

#### JavaScript 模板

参考 `scripts/templates/task_template.ts`。

#### Python 模板

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
脚本功能描述
@Author: Astral
@Date: 2025-01-27
@cron: 30 7 * * *
@环境变量: ENV_VAR_NAME 变量说明
"""

import os
import sys
import requests
from typing import Dict, Any

class Task:
    def __init__(self, config: str, index: int):
        self.config = config.strip()
        self.index = index

    async def start(self) -> None:
        """主入口"""
        try:
            print(f"\n========== 账号 {self.index + 1} ==========")

            # 业务逻辑
            await self.main()

            print(f"账号 {self.index + 1} 执行完成")
        except Exception as e:
            print(f"账号 {self.index + 1} 执行失败: {str(e)}")

    async def main(self) -> None:
        """主逻辑"""
        # 1. 获取用户信息
        await self.get_user_info()

        # 2. 执行签到
        await self.sign_in()

        # 3. 领取奖励
        await self.get_reward()

    async def get_user_info(self) -> None:
        """获取用户信息"""
        try:
            print("📋 获取用户信息...")

            response = requests.get(
                'https://api.example.com/user/info',
                headers={
                    'Authorization': f'Bearer {self.config}',
                    'User-Agent': 'AutoPilot/1.0'
                },
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                print(f"用户: {data['data']['username']}")
            else:
                print(f"获取用户信息失败: {data.get('message')}")
        except Exception as e:
            print(f"获取用户信息异常: {str(e)}")

    async def sign_in(self) -> None:
        """签到"""
        try:
            print("📝 开始签到...")

            response = requests.post(
                'https://api.example.com/user/signin',
                headers={
                    'Authorization': f'Bearer {self.config}',
                    'User-Agent': 'AutoPilot/1.0'
                },
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                print(f"签到成功，获得 {data['data']['points']} 积分")
            elif response.status_code == 400 and '已签到' in data.get('message', ''):
                print("今日已签到")
            else:
                print(f"签到失败: {data.get('message')}")
        except Exception as e:
            print(f"签到异常: {str(e)}")

    async def get_reward(self) -> None:
        """领取奖励"""
        try:
            print("🎁 领取奖励...")

            response = requests.post(
                'https://api.example.com/user/reward',
                headers={
                    'Authorization': f'Bearer {self.config}',
                    'User-Agent': 'AutoPilot/1.0'
                },
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                print(f"领取奖励成功: {data['data']['name']}")
            elif response.status_code == 400 and '已领取' in data.get('message', ''):
                print("奖励已领取")
            else:
                print(f"领取奖励失败: {data.get('message')}")
        except Exception as e:
            print(f"领取奖励异常: {str(e)}")

async def main():
    """主函数"""
    env_value = os.getenv('ENV_VAR_NAME')

    if not env_value:
        print("未找到环境变量 ENV_VAR_NAME")
        return

    # 解析多账号
    users = env_value.split('&')

    for idx, user_config in enumerate(users):
        if user_config.strip():
            task = Task(user_config, idx)
            await task.start()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
```

### 最佳实践

#### 1. 错误处理

```javascript
try {
  await this.signIn();
} catch (error) {
  $.log(`签到失败: ${error.message}`, 'error');
  // 不要吞掉错误，记录并继续
}
```

#### 2. 重试机制

```javascript
async function requestWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await $.get(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await $.sleep(1000 * (i + 1));
    }
  }
}
```

#### 3. 日志记录

```javascript
$.log('普通信息', 'info');
$.log('警告信息', 'warn');
$.log('错误信息', 'error');
$.debug('调试信息');
```

#### 4. 数据持久化

```javascript
const storage = $.getStorage('task_name');

// 保存数据
await storage.setItem('key', { data: 'value' });

// 读取数据
const data = await storage.getItem('key');
```

#### 5. 环境变量验证

```javascript
if (!this.config || !this.config.trim()) {
  $.log('配置为空', 'error');
  return;
}
```

## 测试

### 单元测试

使用 Jest 进行单元测试。

**创建测试文件：**

```javascript
// tests/example.test.js
const { md5, randomString } = require('../scripts/utils/common');

describe('工具函数测试', () => {
  test('md5 应该正确加密字符串', () => {
    expect(md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  test('randomString 应该生成指定长度的随机字符串', () => {
    const str = randomString(10);
    expect(str).toHaveLength(10);
  });
});
```

**运行测试：**

```bash
npm test
```

### 集成测试

测试脚本与青龙面板的集成。

```javascript
// tests/integration.test.js
const { Env } = require('../scripts/utils/Env');

describe('Env 类集成测试', () => {
  test('应该正确初始化和执行任务', async () => {
    const $ = new Env('测试脚本');

    class TestTask {
      constructor(config, index) {
        this.config = config;
        this.index = index;
      }

      async start() {
        $.log(`账号 ${this.index + 1} 执行成功`);
      }
    }

    process.env.TEST_VAR = 'test1&test2';
    await $.init(TestTask, 'TEST_VAR');

    expect($.msgs.length).toBeGreaterThan(0);
  });
});
```

### 手动测试

在青龙面板中手动运行脚本，检查：

1. 环境变量是否正确读取
2. 多账号是否正常执行
3. 错误是否正确处理
4. 通知是否正常发送
5. 日志是否清晰明了

## 发布流程

### 版本管理

使用语义化版本号：`MAJOR.MINOR.PATCH`

- `MAJOR`：不兼容的 API 修改
- `MINOR`：向下兼容的功能性新增
- `PATCH`：向下兼容的问题修正

### 发布步骤

1. **更新版本号**

更新 `repository.json` 和 `package.json` 中的版本号。

2. **更新 CHANGELOG**

创建或更新 `CHANGELOG.md` 文件，记录变更内容。

3. **运行测试**

```bash
npm test
npm run lint
```

4. **提交代码**

```bash
git add .
git commit -m "chore: release v1.0.0"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

5. **发布到 GitHub**

在 GitHub 上创建 Release：

1. 进入仓库的 "Releases" 页面
2. 点击 "Draft a new release"
3. 选择标签（如 `v1.0.0`）
4. 编写 Release Notes
5. 点击 "Publish release"

## 更多信息

- 项目主页：https://github.com/astralwaveorg/autopilot
- 使用文档：[USAGE.md](./USAGE.md)
- 问题反馈：https://github.com/astralwaveorg/autopilot/issues

## 许可证

MIT License