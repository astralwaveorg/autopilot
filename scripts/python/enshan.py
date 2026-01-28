"""
恩山无线论坛签到
cron: 0 9 * * *
变量名: ENSHAN_COOKIE (格式: cookie，多账号使用 @ 或 & 或 换行 分割)
@Author: Astral
@Date: 2026-01-28
"""

import os
import re
import sys
import time
import random
import requests
import urllib3

# 禁用安全请求警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def load_send():
    cur_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(cur_path)
    if os.path.exists(os.path.join(cur_path, "notify.py")):
        try:
            from notify import send

            return send
        except ImportError:
            return None
    return None


class EnShan:
    def __init__(self, cookie):
        self.cookie = cookie
        self.msg = ""
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.125 Safari/537.36",
            "Cookie": self.cookie,
            "Referer": "https://www.right.com.cn/FORUM/forum.php",
        }

    def get_info(self):
        url = (
            "https://www.right.com.cn/FORUM/home.php?mod=spacecp&ac=credit&showcredit=1"
        )
        try:
            response = requests.get(url, headers=self.headers, verify=False, timeout=15)
            text = response.text

            if "恩山币" in text:
                coin = re.findall(r"恩山币: </em>(.*?)&nbsp;", text)
                point = re.findall(r"<em>积分: </em>(.*?)<span", text)
                user_name = re.findall(r'title="访问我的空间">(.*?)</a>', text)

                name = user_name[0] if user_name else "未知用户"
                c_val = coin[0] if coin else "获取失败"
                p_val = point[0] if point else "获取失败"

                print(f"[INFO] 账号: {name} | 恩山币: {c_val} | 积分: {p_val}")
                self.msg += f"账号: {name}\n恩山币: {c_val}\n积分: {p_val}\n"
            elif "请先登录" in text:
                print("[WARN] Cookie 已失效或错误")
                self.msg += "状态: Cookie 失效\n"
            else:
                print("[ERROR] 页面解析失败")
                self.msg += "状态: 解析异常\n"
        except Exception as e:
            print(f"[ERROR] 请求异常: {str(e)}")
            self.msg += f"异常: {str(e)}\n"

    def run(self):
        self.get_info()
        return self.msg


def main():
    var_name = "ENSHAN_COOKIE"
    env_str = os.getenv(var_name)
    if not env_str:
        print(f"[ERROR] 未找到环境变量 {var_name}")
        return

    # 解析多账号
    if "@" in env_str:
        accounts = env_str.split("@")
    elif "&" in env_str:
        accounts = env_str.split("&")
    elif "\n" in env_str:
        accounts = env_str.split("\n")
    else:
        accounts = [env_str]

    final_msg_list = []
    print(f"[INFO] 检测到 {len(accounts)} 个账号")

    for idx, ck in enumerate(accounts):
        if not ck.strip():
            continue
        print(f"\n[INFO] ---------- 开始第 {idx+1} 个账号 ----------")
        worker = EnShan(ck.strip())
        res = worker.run()
        final_msg_list.append(res)
        if idx < len(accounts) - 1:
            time.sleep(random.randint(2, 5))

    # 汇总通知
    final_report = "【恩山无线论坛任务报告】\n\n" + "\n".join(final_msg_list)
    print("\n[INFO] 所有账号任务执行完毕")

    send = load_send()
    if send:
        send("恩山论坛签到", final_report)
    else:
        print("[INFO] 未配置通知服务，仅控制台输出")


if __name__ == "__main__":
    main()
