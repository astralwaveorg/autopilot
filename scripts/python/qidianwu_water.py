#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
七点五饮用天然矿泉水自动签到脚本

环境变量:
    QDWXCX_COOKIE: 微信小程序Cookie，格式：备注#SID，多个账号用换行或@分隔

参考文档: https://servicewechat.com/
"""

import os
import requests
import json
import time


def send_notification(title, content):
    """发送通知"""
    try:
        notify_file = os.path.join(os.path.dirname(__file__), '../utils/sendNotify.js')
        if os.path.exists(notify_file):
            print(f"{title}: {content}")
    except Exception as e:
        print(f"通知发送失败: {e}")


def sign_in(sid):
    """签到"""
    url = "https://h5.youzan.com/wscump/checkin/checkinV2.json?checkinId=3997371"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b11) XWEB/9129',
        'xweb_xhr': '1',
        'Cookie': f'KDTWEAPPSESSIONID={sid}'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        time.sleep(2)
        return response.text
    except Exception as e:
        print(f"签到失败: {e}")
        return None


def get_points(sid):
    """获取积分"""
    url = "https://h5.youzan.com/wscump/pointstore/getCustomerPoints.json"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b11) XWEB/9129',
        'Cookie': f'KDTWEAPPSESSIONID={sid}'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        data = json.loads(response.text)
        points = data['data']['currentAmount']
        
        # 获取签到天数
        url2 = "https://h5.youzan.com/wscump/checkin/get_activity_by_yzuid_v2.json?checkinId=3997371"
        headers2 = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b11) XWEB/9129',
            'Cookie': f'KDTWEAPPSESSIONID={sid}'
        }
        
        response2 = requests.get(url2, headers=headers2, timeout=10)
        data2 = json.loads(response2.text)
        days = data2['data']['continuesDay']
        
        return f"目前积分: {points}\n签到天数: {days}"
    except Exception as e:
        print(f"积分查询失败: {e}")
        return "积分查询失败"


def main():
    """主函数"""
    cookies = os.getenv('QDWXCX_COOKIE', '')

    if not cookies:
        print("未配置环境变量 QDWXCX_COOKIE")
        return

    # 分隔符处理
    for sep in ['@', '\n']:
        if sep in cookies:
            cookies = cookies.split(sep)
            break
    else:
        cookies = [cookies]

    print(f"共 {len(cookies)} 个账号")

    for index, cookie in enumerate(cookies, 1):
        if not cookie.strip():
            continue

        parts = cookie.split('#')
        if len(parts) < 2:
            print(f"账号 {index} 格式错误，跳过")
            continue

        remark = parts[0].strip()
        sid = parts[1].strip()

        print(f"\n========== 账号 {index}: {remark} ==========")

        # 签到
        print("开始签到...")
        sign_in(sid)

        # 查询积分
        print("查询积分...")
        points_info = get_points(sid)

        print(f"账号 {index} 完成")
        print(f"{points_info}")


if __name__ == "__main__":
    main()