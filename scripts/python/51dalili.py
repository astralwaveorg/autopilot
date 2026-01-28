"""
脚本名称: 51代理每日签到
cron: 10 8 * * *
变量名: dali51user, daili51pass
@Author: Astral
@Date: 2026-01-28
"""

import requests
from bs4 import BeautifulSoup
import time
import os


def main():
    script_name = "51代理签到"
    username = os.getenv("dali51user")
    password = os.getenv("daili51pass")

    print(f"--- {script_name} 开始执行 ---")

    if not username or not password:
        print("[ERROR] 请设置环境变量 dali51user 和 daili51pass")
        return

    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://www.51daili.com/",
    }

    try:
        # 1. 访问首页获取初始 PHPSESSID 和登录 Token
        print("[INFO] 正在获取初始页面信息...")
        response = session.get("https://www.51daili.com", headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        token_input = soup.find("input", {"name": "__login_token__"})
        login_token = token_input.get("value") if token_input else None

        if not login_token:
            print("[WARN] 未能动态获取登录令牌，尝试执行后续流程")

        # 2. 执行登录
        print("[INFO] 正在尝试登录...")
        login_url = "https://www.51daili.com/index/user/login.html"
        login_data = {
            "__login_token__": login_token,
            "account": username,
            "password": password,
            "ticket": "1",
            "keeplogin": "1",
            "is_read": "1",
        }

        # 51代理登录通常需要校验 tncode (滑动验证)，若脚本在服务器运行可能遇到拦截
        # 此处模拟带上必要的 Cookie 状态
        headers["X-Requested-With"] = "XMLHttpRequest"
        login_response = session.post(
            login_url, data=login_data, headers=headers, timeout=15
        )

        # 3. 检查登录状态并尝试签到
        # 51代理成功登录后会在 Cookie 中植入 token
        if "token" in session.cookies.get_dict():
            print("[INFO] 登录成功，正在执行签到...")

            # 访问签到接口
            signin_url = "https://www.51daili.com/index/user/signin.html"
            signin_response = session.get(signin_url, headers=headers, timeout=15)

            # 51代理签到接口通常返回 JSON
            try:
                res_json = signin_response.json()
                msg = res_json.get("msg", "未知响应")
                if res_json.get("code") == 1:
                    print(f"[INFO] 签到成功: {msg}")
                else:
                    print(f"[INFO] 签到结果: {msg}")
            except:
                # 如果不是 JSON，尝试解析页面内容
                if (
                    "成功" in signin_response.text
                    or "今天已签到" in signin_response.text
                ):
                    print("[INFO] 签到完成 (通过页面特征识别)")
                else:
                    print("[ERROR] 签到页面响应异常，请检查账号状态")
        else:
            print(f"[ERROR] 登录失败，响应内容: {login_response.text[:100]}")
            print("[HINT] 可能遇到了验证码拦截，请尝试在本地浏览器成功登录后再试")

    except Exception as e:
        print(f"[ERROR] 执行异常: {str(e)}")


if __name__ == "__main__":
    main()
