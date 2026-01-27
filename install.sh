#!/bin/bash
#
# AutoPilot 一键安装脚本
#

set -e

echo "🚀 开始安装 AutoPilot..."
echo "========================================"

# 检查青龙面板环境
if [ ! -d "/ql" ]; then
    echo "❌ 错误: 未检测到青龙面板环境"
    exit 1
fi

# 拉取仓库
echo "📥 拉取脚本仓库..."
ql repo https://github.com/yourname/autopilot.git "scripts" "" "" "main"

echo "✅ AutoPilot 安装完成！"
echo "========================================"
echo "📋 接下来需要手动配置："
echo "1. 前往'环境变量'页面，参考 configs/env_template.txt 配置账号信息"
echo "2. 前往'依赖管理'安装所需的依赖包"
echo "3. 在'定时任务'中启用需要的脚本"
echo ""
echo "💡 如需使用实验性功能，请手动执行：bash /ql/scripts/autopilot/scripts/lab_enable.sh"
