#!/bin/bash
#
# AutoPilot 一键安装脚本
#
# @author Astral
# @version 1.0.0
#

set -e

echo "🚀 开始安装 AutoPilot..."
echo "========================================"

# 检查青龙面板环境
if [ ! -d "/ql" ]; then
	echo "❌ 错误: 未检测到青龙面板环境"
	echo "💡 请确保在青龙面板中运行此脚本"
	exit 1
fi

# 拉取仓库
echo "📥 拉取脚本仓库..."
ql repo https://github.com/astralwaveorg/autopilot.git "scripts" "" "" "main"

echo "✅ AutoPilot 安装完成！"
echo "========================================"
echo "📋 接下来需要手动配置："
echo ""
echo "1. 前往'环境变量'页面，参考 configs/env.example 配置账号信息"
echo "2. 前往'依赖管理'安装所需的依赖包："
echo "   - Node.js: 复制 dependencies/package.json 中的依赖"
echo "   - Python3: 复制 dependencies/requirements.txt 中的依赖"
echo "3. 在'定时任务'中启用需要的脚本，参考 configs/crontab.example"
echo ""
echo "💡 提示："
echo "- 所有脚本都支持多账号，使用 &、\\n 或 @ 分隔"
echo "- 通知策略可通过环境变量 NOTIFY_TYPE 控制（0-禁用, 1-仅异常, 2-全通知）"
echo "- 详细使用文档请查看 README.md"
echo ""
echo "📚 更多信息："
echo "- GitHub: https://github.com/astralwaveorg/autopilot"
echo "- 文档: https://github.com/astralwaveorg/autopilot/blob/main/README.md"
echo ""
echo "🎉 享受自动化带来的便利吧！"
