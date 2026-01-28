"""
脚本名称: 阿里云盘自动签到
cron: 0 0 9 * * *
变量名: ALIYUN_DRIVE_TOKEN
@Author: Astral
@Date: 2026-01-28
"""

import os
import requests
import time


def main():
    script_name = "阿里云盘签到"
    env_name = "ALIYUN_DRIVE_TOKEN"

    print(f"--- {script_name} 开始执行 ---")

    raw_env = os.environ.get(env_name, "")
    if not raw_env:
        print(f"[ERROR] 未找到环境变量 {env_name}")
        return

    # 多账号分隔符适配
    splitters = ["@", "\n", "&"]
    target_sep = next((s for s in splitters if s in raw_env), splitters[0])
    tokens = [t.strip() for t in raw_env.split(target_sep) if t.strip()]

    print(f"[INFO] 发现 {len(tokens)} 个账号\n")

    for idx, refresh_token in enumerate(tokens, 1):
        print(f"账号 [{idx}] 正在处理...")
        try:
            # 1. 刷新 Token
            token_url = "https://auth.aliyundrive.com/v2/account/token"
            token_res = requests.post(
                token_url,
                json={"grant_type": "refresh_token", "refresh_token": refresh_token},
                timeout=15,
            ).json()

            access_token = token_res.get("access_token")
            if not access_token:
                print(f"[ERROR] 账号 [{idx}] Token 刷新失败，请检查 refresh_token")
                continue

            nickname = token_res.get("nick_name", "未知用户")
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
            }

            # 2. 签到
            sign_url = "https://member.aliyundrive.com/v1/activity/sign_in_list"
            sign_res = requests.post(
                sign_url, headers=headers, json={}, timeout=15
            ).json()

            if sign_res.get("success"):
                result = sign_res.get("result", {})
                sign_count = result.get("signInCount", 0)
                print(f"[INFO] 账号 [{nickname}] 签到成功，本月累计 {sign_count} 天")

                # 3. 领取奖励
                reward_url = "https://member.aliyundrive.com/v1/activity/sign_in_reward"
                reward_res = requests.post(
                    reward_url,
                    headers=headers,
                    json={"signInDay": sign_count},
                    timeout=15,
                ).json()

                if reward_res.get("success"):
                    reward_info = reward_res.get("result", {})
                    print(
                        f"[INFO] 奖励领取成功: {reward_info.get('name', '')} - {reward_info.get('description', '')}"
                    )
                else:
                    print(
                        f"[INFO] 奖励今日已领取或暂无奖励: {reward_res.get('message', '')}"
                    )
            else:
                print(
                    f"[ERROR] 账号 [{nickname}] 签到失败: {sign_res.get('message', '未知错误')}"
                )

        except Exception as e:
            print(f"[ERROR] 账号 [{idx}] 运行异常: {str(e)}")

        if idx < len(tokens):
            time.sleep(2)


if __name__ == "__main__":
    main()
