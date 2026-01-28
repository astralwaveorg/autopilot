"""
七点五饮用天然矿泉水签到
cron: 0 9 * * *
变量名: qdwxcxcookie (格式: 备注#sid，多账号使用 @ 或 & 或 换行 分割)
@Author: Astral
@Date: 2026-01-28
"""

import os
import sys
import json
import time
import random
import requests


def load_send():
    cur_path = os.path.abspath(path.dirname(__file__))
    sys.path.append(cur_path)
    if os.path.exists(os.path.join(cur_path, "notify.py")):
        try:
            from notify import send

            return send
        except ImportError:
            return None
    return None


class Qidianwu:
    def __init__(self, ck):
        self.msg = ""
        try:
            self.beizhu = ck.split("#")[0]
            self.sid = ck.split("#")[1]
        except IndexError:
            self.beizhu = "未知账号"
            self.sid = ck

        self.ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b11) XWEB/9129"
        self.headers = {
            "User-Agent": self.ua,
            "Cookie": f"KDTWEAPPSESSIONID={self.sid}",
            "extra-data": f"sid={self.sid}",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Referer": "https://servicewechat.com/wx5508c9ab0d2118ff/63/page-frame.html",
        }

    def sign(self):
        url = "https://h5.youzan.com/wscump/checkin/checkinV2.json?checkinId=3997371"
        try:
            print(f"[INFO] 账号 [{self.beizhu}] 开始签到...")
            res = requests.get(url, headers=self.headers, timeout=15).json()
            if res.get("code") == 0:
                print(f"[INFO] 签到成功")
                self.msg += f"账号[{self.beizhu}] 签到结果: 成功\n"
            else:
                print(f"[WARN] 签到结果: {res.get('msg', '未知错误')}")
                self.msg += f"账号[{self.beizhu}] 签到结果: {res.get('msg')}\n"
        except Exception as e:
            print(f"[ERROR] 签到异常: {str(e)}")
            self.msg += f"账号[{self.beizhu}] 签到异常\n"

    def get_info(self):
        points_url = "https://h5.youzan.com/wscump/pointstore/getCustomerPoints.json"
        days_url = "https://h5.youzan.com/wscump/checkin/get_activity_by_yzuid_v2.json?checkinId=3997371"
        try:
            p_res = requests.get(points_url, headers=self.headers, timeout=15).json()
            d_res = requests.get(days_url, headers=self.headers, timeout=15).json()

            if p_res.get("code") == 0 and d_res.get("code") == 0:
                points = p_res["data"].get("currentAmount", 0)
                days = d_res["data"].get("continuesDay", 0)
                print(f"[INFO] 当前积分: {points}, 连续签到: {days}天")
                self.msg += f"当前积分: {points}\n连续签到: {days}天\n"
            else:
                print(f"[ERROR] 信息查询失败")
        except Exception as e:
            print(f"[ERROR] 信息查询异常: {str(e)}")

    def run(self):
        self.sign()
        time.sleep(random.randint(1, 3))
        self.get_info()
        return self.msg


def main():
    var_name = "qdwxcxcookie"
    env_str = os.getenv(var_name)
    if not env_str:
        print(f"[ERROR] 未找到环境变量 {var_name}")
        return

    # 适配多种分隔符
    for sep in ["@", "&", "\n"]:
        if sep in env_str:
            accounts = env_str.split(sep)
            break
    else:
        accounts = [env_str]

    final_msg = "七点五饮用天然矿泉水任务报告\n"
    for idx, ck in enumerate(accounts):
        if not ck.strip():
            continue
        print(f"\n[INFO] ---------- 第 {idx+1} 个账号 ----------")
        worker = Qidianwu(ck.strip())
        final_msg += worker.run()
        time.sleep(random.randint(2, 5))

    print("\n[INFO] 任务执行完毕")
    send = load_send()
    if send:
        send("七点五矿泉水签到通知", final_msg)


if __name__ == "__main__":
    main()
