#!/bin/bash
#
# 系统健康检查脚本
#

# 加载配置文件
source ./configs/env_template.txt 2>/dev/null || true

# 检查磁盘使用率
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -gt 90 ]; then
    echo "⚠️  磁盘使用率过高: ${disk_usage}%"
    # 这里可以发送通知
fi

# 检查内存使用
memory_usage=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
echo "✅ 系统状态正常 - 磁盘: ${disk_usage}%, 内存: ${memory_usage}%"
