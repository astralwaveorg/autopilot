"""
潮新闻
cron: 12,28 9 * * *
变量名: cxwck
变量值: 手机号#密码 (多账号用 换行 或 @ 分割)
@Author: Astral
@Date: 2026-01-29
"""

import os
import sys
import time
import json
import random
import hashlib
import hmac
import requests
from datetime import datetime

# ==========================================
# 基础配置与工具函数
# ==========================================
ENV_NAME = 'cxwck'

def get_env_variable(var_name):
    """
    获取并解析环境变量，支持 @, \n, & 分割
    """
    value = os.environ.get(var_name)
    if not value:
        return []
    
    separators = ['@', '\n', '&']
    for sep in separators:
        if sep in value:
            return [x.strip() for x in value.split(sep) if x.strip()]
    return [value.strip()]

def log(level, message):
    """
    标准化日志输出
    """
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{level}] {current_time} - {message}")

def wait_random(min_seconds=2, max_seconds=5):
    """
    随机等待
    """
    delay = random.randint(min_seconds, max_seconds)
    time.sleep(delay)

# ==========================================
# 核心业务逻辑
# ==========================================

class ChaoNewsUser:
    def __init__(self, index, account_str):
        self.index = index
        self.account_str = account_str
        self.mobile = ""
        self.password = ""
        self.session_id = ""
        self.account_id = ""
        self.nickname = "未登录"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G960F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36",
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json, text/plain, */*",
            "Host": "api.cnews.com.cn"
        }
        self.parse_account()

    def parse_account(self):
        """解析账号字符串"""
        try:
            if "#" in self.account_str:
                self.mobile, self.password = self.account_str.split("#")
            else:
                log("ERROR", f"账号 {self.index} 格式错误，请使用 手机号#密码")
        except Exception as e:
            log("ERROR", f"账号 {self.index} 解析异常: {e}")

    def generate_signature(self, path, body="", timestamp=None):
        """
        模拟签名生成 (通用逻辑适配)
        注意：潮新闻签名算法较复杂且常变，此处使用标准请求头。
        如果API强制校验签名，可能需要抓包获取固定Token或Session。
        """
        if not timestamp:
            timestamp = str(int(time.time() * 1000))
        
        # 构造基础 headers
        self.headers["X-TIMESTAMP"] = timestamp
        self.headers["X-REQUEST-ID"] = hashlib.md5((timestamp + str(random.random())).encode()).hexdigest()
        # 实际签名算法通常涉及 app_secret，此处省略保持通用性
        return

    def login(self):
        """执行登录"""
        if not self.mobile or not self.password:
            return False

        url = "https://api.cnews.com.cn/v1/users/login_by_mobile"
        body = {
            "mobile": self.mobile,
            "password": self.password, # 部分版本可能需要MD5: hashlib.md5(self.password.encode()).hexdigest()
            "type": "1"
        }
        
        self.generate_signature(url, json.dumps(body))
        
        try:
            # 尝试发送请求，注意：如果不通过签名校验，此处可能失败
            # 建议用户：如果脚本登录失败，说明官方升级了风控，需抓包获取 session_id
            response = requests.post(url, headers=self.headers, json=body, timeout=15)
            data = response.json()
            
            if data.get("code") == 0 or data.get("code") == 200:
                result = data.get("data", {})
                self.session_id = result.get("session_id")
                self.account_id = result.get("account_id")
                self.nickname = result.get("nickname", self.mobile)
                
                # 更新鉴权头
                self.headers["X-SESSION-ID"] = self.session_id
                log("INFO", f"账号 {self.index} [{self.nickname}] 登录成功")
                return True
            else:
                log("WARN", f"账号 {self.index} 登录失败: {data.get('msg', '未知错误')}")
                return False
        except Exception as e:
            log("ERROR", f"账号 {self.index} 登录请求异常: {e}")
            return False

    def get_user_info(self):
        """获取用户信息/刷新状态"""
        url = "https://api.cnews.com.cn/v1/users/info"
        try:
            res = requests.get(url, headers=self.headers, timeout=15).json()
            if res.get("code") == 0:
                self.nickname = res["data"].get("nickname", self.nickname)
                # log("INFO", f"更新用户信息成功: {self.nickname}")
                return True
            return False
        except:
            return False

    def do_sign(self):
        """每日签到"""
        url = "https://api.cnews.com.cn/v1/activity/sign_in"
        try:
            res = requests.post(url, headers=self.headers, json={}, timeout=15).json()
            if res.get("code") == 0:
                log("INFO", f"账号 {self.index} 签到成功")
            elif "已签到" in str(res.get("msg")):
                log("INFO", f"账号 {self.index} 今日已签到")
            else:
                log("WARN", f"账号 {self.index} 签到失败: {res.get('msg')}")
        except Exception as e:
            log("ERROR", f"签到异常: {e}")

    def get_task_list(self):
        """获取任务列表"""
        url = "https://api.cnews.com.cn/v1/task/list"
        try:
            res = requests.get(url, headers=self.headers, timeout=15).json()
            if res.get("code") == 0:
                return res.get("data", {}).get("list", [])
            return []
        except Exception as e:
            log("ERROR", f"获取任务列表失败: {e}")
            return []

    def do_article_task(self):
        """执行阅读/点赞任务"""
        log("INFO", f"账号 {self.index} 开始执行阅读任务...")
        
        # 获取新闻列表
        list_url = "https://api.cnews.com.cn/v1/article/list?channel_id=1&page=1"
        try:
            res = requests.get(list_url, headers=self.headers, timeout=15).json()
            articles = res.get("data", {}).get("list", [])
        except:
            articles = []

        count = 0
        for article in articles:
            if count >= 5: # 每次运行阅读5篇，避免风控
                break
                
            article_id = article.get("id")
            if not article_id: continue

            # 阅读
            read_url = "https://api.cnews.com.cn/v1/article/read"
            try:
                requests.post(read_url, headers=self.headers, json={"id": article_id}, timeout=10)
                log("INFO", f"阅读文章 ID:{article_id} 完成")
                count += 1
                wait_random(2, 4)
                
                # 随机点赞 (30%概率)
                if random.random() < 0.3:
                    like_url = "https://api.cnews.com.cn/v1/article/like"
                    requests.post(like_url, headers=self.headers, json={"id": article_id, "type": 1}, timeout=10)
                    log("INFO", f"点赞文章 ID:{article_id}")
                    wait_random(1, 2)
                    
            except Exception as e:
                log("WARN", f"任务执行中断: {e}")

    def run(self):
        """执行流程"""
        log("INFO", f"====== 账号 {self.index} 开始运行 ======")
        
        if not self.login():
            log("ERROR", f"账号 {self.index} 登录失败，跳过后续任务")
            return

        # 随机延迟防并发检测
        wait_random(1, 3)
        
        self.do_sign()
        self.do_article_task()
        
        log("INFO", f"====== 账号 {self.index} 运行结束 ======\n")

# ==========================================
# 主程序入口
# ==========================================

def main():
    log("INFO", f"脚本启动，当前版本: 2.0.0 (Python)")
    
    accounts = get_env_variable(ENV_NAME)
    if not accounts:
        log("ERROR", f"未检测到环境变量 {ENV_NAME}，请添加后重试。")
        return

    log("INFO", f"共检测到 {len(accounts)} 个账号")
    
    for i, account_str in enumerate(accounts):
        user = ChaoNewsUser(i + 1, account_str)
        user.run()

if __name__ == "__main__":
    main()
