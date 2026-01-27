# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-27

### Added

#### 核心功能
- 🎯 **模块化架构**：清晰的项目结构，易于维护和扩展
- 🔄 **多账号支持**：统一的多账号管理机制，支持多种分隔符
- 📢 **智能通知**：支持20+种通知渠道，智能通知策略
- 🛡️ **错误处理**：完善的错误处理和日志记录机制
- 🔧 **便于扩展**：标准化的脚本模板，快速添加新脚本
- 📦 **类型安全**：TypeScript支持，提供更好的开发体验
- 🌐 **泛用性强**：支持多种平台和配置方式
- 🧪 **自动化测试**：完整的测试覆盖，确保代码质量

#### 核心模块
- **Env 类** (`scripts/utils/Env.ts`)
  - 统一的环境管理封装
  - 多账号自动解析和管理
  - 日志记录和消息收集
  - 智能通知发送
  - 持久化存储支持

- **common.ts** (`scripts/utils/common.ts`)
  - 50+ 通用工具函数
  - 字符串生成和处理
  - 数据脱敏
  - 时间处理
  - 加密解密
  - 数据验证
  - 数组操作
  - HTTP 请求封装

- **ql.ts** (`scripts/utils/ql.ts`)
  - 青龙面板 API 完整封装
  - 环境变量管理
  - 任务管理
  - 系统信息获取

#### 脚本模板
- **TypeScript 模板** (`scripts/templates/task_template.ts`)
  - 标准化的脚本结构
  - 完整的错误处理
  - 清晰的日志输出

- **JavaScript 模板** (`scripts/checkin/example_signin.js`)
  - 示例签到脚本
  - 完整的业务流程
  - 最佳实践示例

#### 配置文件
- **env.example** (`configs/env.example`)
  - 完整的环境变量说明
  - 20+ 种通知方式配置
  - 详细的注释和示例

- **crontab.example** (`configs/crontab.example`)
  - 定时任务配置示例
  - 执行时间建议
  - 注意事项说明

#### 文档
- **README.md**：项目介绍和快速开始
- **USAGE.md**：详细使用指南
- **DEVELOPMENT.md**：开发指南和最佳实践
- **CHANGELOG.md**：版本变更记录

#### 依赖管理
- **package.json**：Node.js 依赖配置
- **requirements.txt**：Python 依赖配置
- **tsconfig.json**：TypeScript 配置

#### 工具脚本
- **install.sh**：一键安装脚本
- **.gitignore**：Git 忽略配置

### Changed

- 📁 **项目结构重组**：采用更清晰的模块化结构
- 🎨 **代码规范统一**：统一的命名规范和代码风格
- 📝 **注释完善**：所有核心代码都有详细注释
- 🔒 **安全性提升**：移除所有广告和无用代码

### Fixed

- 🐛 **错误处理**：完善了各种异常情况的处理
- 🔧 **兼容性**：确保与青龙面板的完全兼容
- 📊 **日志输出**：优化了日志的格式和内容

### Removed

- ❌ **广告内容**：移除所有广告和推广内容
- ❌ **无用代码**：删除未使用的代码和文件
- ❌ **临时文件**：清理 tmp 目录中的临时文件

## [0.0.0] - 2025-01-27

### Added

- 🎉 项目初始化
- 📦 基础项目结构
- 📝 基础文档

---

## 版本说明

### 版本号格式

采用语义化版本号：`MAJOR.MINOR.PATCH`

- **MAJOR**：不兼容的 API 修改
- **MINOR**：向下兼容的功能性新增
- **PATCH**：向下兼容的问题修正

### 变更类型

- **Added**：新增功能
- **Changed**：功能变更
- **Deprecated**：即将废弃的功能
- **Removed**：已移除的功能
- **Fixed**：问题修复
- **Security**：安全相关修复

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件