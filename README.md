# AutoPilot

> 简洁、强大的青龙面板脚本库，让自动化成为您的自动驾驶仪。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/astralwaveorg/autopilot)
[![Author](https://img.shields.io/badge/author-Astral-green.svg)](https://github.com/astralwaveorg)

## 特性

- 模块化设计 - 清晰的代码组织，易于维护和扩展
- 多账号支持 - 统一的多账号管理机制
- 智能通知 - 支持20+种通知渠道，智能通知策略
- 错误处理 - 完善的错误处理和日志记录
- 易于扩展 - 标准化的脚本模板，快速添加新脚本
- 类型安全 - TypeScript支持，提供更好的开发体验
- 泛用性强 - 支持多种平台和配置方式
- 自动化测试 - 完整的测试覆盖，确保代码质量

## 项目结构

```
autopilot/
├── scripts/                 # 主脚本目录（102个脚本）
│   ├── utils/              # 核心工具模块
│   │   ├── Env.ts          # 环境管理类
│   │   ├── common.ts       # 通用工具函数
│   │   ├── sendNotify.js   # 统一通知模块
│   │   └── ql.ts           # 青龙API封装
│   ├── js/                 # JavaScript脚本（61个）
│   ├── python/             # Python脚本（14个）
│   ├── shell/              # Shell脚本（0个）
│   ├── ts/                 # TypeScript脚本（23个）
│   └── storage/            # 持久化存储
├── configs/                # 配置文件
│   ├── env.example         # 环境变量示例
│   └── crontab.example     # 定时任务示例
├── dependencies/           # 依赖管理
│   ├── package.json        # Node.js依赖
│   └── requirements.txt    # Python依赖
├── tests/                  # 测试文件
├── docs/                   # 文档
│   ├── USAGE.md            # 使用指南
│   ├── DEVELOPMENT.md      # 开发指南
│   └── SCRIPTS.md          # 脚本说明
├── install.sh             # 一键安装脚本
├── repository.json        # 仓库信息
└── README.md              # 项目说明
```

## 脚本统计

| 语言    | 数量 |
|---------|------|
| JavaScript | 61   |
| Python     | 14   |
| TypeScript | 23   |
| **总计**  | **102** |

详细的脚本使用说明请查看 [SCRIPTS.md](docs/SCRIPTS.md)

## 快速开始

### 方式一：一键安装（推荐）

在青龙面板中执行：

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/astralwaveorg/autopilot/main/install.sh)"
```

### 方式二：手动添加仓库

在青龙面板"订阅管理"中添加：

```bash
ql repo https://github.com/astralwaveorg/autopilot.git "scripts" "" "" "main"
```

## 配置说明

### 1. 环境变量配置

参考 `configs/env.example` 文件，在青龙面板"环境变量"页面配置：

```bash
# 通知配置
PUSH_PLUS_TOKEN=your_token_here
TG_BOT_TOKEN=your_bot_token
TG_USER_ID=your_user_id

# 通知策略（0-禁用, 1-仅异常, 2-全通知）
NOTIFY_TYPE=1
```

### 2. 依赖安装

在青龙面板"依赖管理"中安装：

- **Node.js**: 复制 `dependencies/package.json` 中的依赖
- **Python3**: 复制 `dependencies/requirements.txt` 中的依赖

### 3. 定时任务配置

参考 `configs/crontab.example` 文件，在青龙面板"定时任务"中设置执行时间。

## 使用文档

### 添加新脚本

1. **选择脚本类型**：
   - `checkin/` - 签到类脚本
   - `info/` - 信息推送类脚本
   - `tools/` - 工具类脚本

2. **使用标准模板**：
   参考 `scripts/templates/` 目录下的模板文件

3. **遵循命名规范**：
   - JavaScript/TypeScript: `功能名称.js` 或 `功能名称.ts`
   - Python: `功能名称.py`

4. **添加环境变量**：
   在 `configs/env.example` 中添加所需的环境变量说明

### 脚本模板示例

```typescript
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

import { Env } from './utils';

const $ = new Env('脚本名称', { sep: ['@', '\n'] });

class Task {
  constructor(private config: string, private index: number) {}

  async start() {
    try {
      $.log(`开始执行账号 ${this.index + 1}`);

      // 业务逻辑
      await this.signIn();

      $.log(`账号 ${this.index + 1} 执行完成`);
    } catch (error) {
      $.log(`账号 ${this.index + 1} 执行失败: ${(error as Error).message}`, 'error');
    }
  }

  async signIn() {
    // 签到逻辑
  }
}

$.init(Task, 'ENV_VAR_NAME').then(() => $.done());
```

### 通知配置

支持以下通知方式：

- PushPlus
- Telegram
- Bark
- Server酱
- 钉钉
- 企业微信
- 飞书
- SMTP邮件
- Go-cqhttp
- Gotify
- PushDeer
- IGot
- Chat
- 微加机器人
- 智能微秘书
- PushMe
- Chronocat
- WxPusher
- Ntfy
- 自定义Webhook

详细配置请参考 `configs/env.example` 文件。

## 测试

运行测试：

```bash
# 安装测试依赖
npm install

# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "test-name"
```

## 参与贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 添加必要的注释和文档
- 编写单元测试
- 确保通过所有测试

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 作者

**Astral** - [GitHub](https://github.com/astralwaveorg)

## 致谢

感谢以下项目提供的灵感和代码参考：

- [QLScriptPublic](https://github.com/smallfawn/QLScriptPublic)
- [ql-scripts](https://github.com/lzwme/ql-scripts)
- [whyour/qinglong](https://github.com/whyour/qinglong)

## 联系方式

- 提交 Issue: [GitHub Issues](https://github.com/astralwaveorg/autopilot/issues)

---

如果这个项目对你有帮助，请给它一个 Star！
