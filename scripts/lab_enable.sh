#!/bin/bash
#
# 实验室功能启用脚本
# 将_labs目录中的脚本链接到根目录使其可见
#

AUTOPILOT_DIR="/ql/scripts/autopilot"
if [ ! -d "$AUTOPILOT_DIR" ]; then
    echo "❌ 错误: 未找到autopilot目录"
    exit 1
fi

cd "$AUTOPILOT_DIR"

echo "🔧 启用实验室功能..."

# 创建_labs中脚本的符号链接
find _labs -name "*.py" -o -name "*.js" -o -name "*.sh" | while read file; do
    filename=$(basename "$file")
    if [ ! -e "../$filename" ]; then
        ln -sf "../$file" "../$filename"
        echo "✅ 启用: $filename"
    fi
done

echo "🎯 实验室功能已启用！实验性脚本现在在面板中可见。"
echo "💡 注意: 这些脚本可能不稳定，请谨慎使用。"
