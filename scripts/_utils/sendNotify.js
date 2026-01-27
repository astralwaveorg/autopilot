/**
 * AutoPilot 统一通知工具
 * 支持多种通知方式：PushPlus、Telegram、钉钉等
 */

async function sendNotify(title, content, type = 'info') {
    const timestamp = new Date().toLocaleString();
    const message = `【AutoPilot】${title}\n时间: ${timestamp}\n内容: ${content}`;
    
    console.log(`📢 ${title}: ${content}`);
    
    // 这里实现实际的通知发送逻辑
    // 会根据环境变量自动选择通知方式
}

module.exports = { sendNotify };
