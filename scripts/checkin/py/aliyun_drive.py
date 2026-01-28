#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""


:
    ALIYUN_DRIVE_TOKEN: refresh_token &\n  @ 

: https://www.aliyundrive.com/
"""

import json
import os
import sys

import requests
import urllib3

urllib3.disable_warnings()


class AliYunDrive:
    """"""

    def __init__(self, token: str):
        self.token = token.strip()
        self.access_token = None
        self.sign_data = None

    def refresh_access_token(self) -> bool:
        """"""
        try:
            url = "https://auth.aliyundrive.com/v2/account/token"
            data = {
                "grant_type": "refresh_token",
                "refresh_token": self.token
            }

            response = requests.post(url, json=data, timeout=10)
            result = response.json()

            if "access_token" in result:
                self.access_token = result["access_token"]
                return True

            print(f" token: {result.get('message', '')}")
            return False

        except Exception as e:
            print(f" token: {str(e)}")
            return False

    def get_sign_list(self) -> bool:
        """"""
        try:
            url = "https://member.aliyundrive.com/v1/activity/sign_in_list"
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }

            response = requests.post(url, headers=headers, json={}, timeout=10)
            result = response.json()

            if "result" in result:
                self.sign_data = result["result"]
                return True

            print(f" : {result.get('message', '')}")
            return False

        except Exception as e:
            print(f" : {str(e)}")
            return False

    def claim_reward(self, sign_day: int) -> bool:
        """"""
        try:
            url = "https://member.aliyundrive.com/v1/activity/sign_in_reward"
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            data = {"signInDay": sign_day}

            response = requests.post(url, headers=headers, json=data, timeout=10)
            result = response.json()

            return result.get("success", False)

        except Exception as e:
            print(f" : {str(e)}")
            return False

    def sign(self) -> dict:
        """"""
        if not self.refresh_access_token():
            return {"status": "fail", "message": "token"}

        if not self.get_sign_list():
            return {"status": "fail", "message": ""}

        sign_count = self.sign_data.get("signInCount", 0)
        sign_logs = self.sign_data.get("signInLogs", [])

        # 
        today_sign = None
        for log in reversed(sign_logs):
            if log.get("status") == "miss":
                continue
            if not log.get("isReward"):
                today_sign = log
                break

        if not today_sign:
            return {
                "status": "success",
                "message": f" {sign_count} "
            }

        # 
        self.claim_reward(sign_count)

        reward = today_sign.get("reward", {})
        reward_name = reward.get("name", "")
        reward_desc = reward.get("description", "")

        message = f" {sign_count} "
        if reward_name:
            message += f"\n: {reward_name} {reward_desc}"

        return {
            "status": "success",
            "message": message
        }


def main():
    """"""
    tokens = os.getenv("ALIYUN_DRIVE_TOKEN", "")

    if not tokens:
        print("  ALIYUN_DRIVE_TOKEN")
        return

    # 
    for sep in ["&", "\n", "@"]:
        if sep in tokens:
            tokens = tokens.split(sep)
            break
    else:
        tokens = [tokens]

    print(f"  {len(tokens)} ")

    for index, token in enumerate(tokens, 1):
        if not token.strip():
            continue

        print(f"\n{'='*40}")
        print(f" {index}/{len(tokens)}")
        print(f"{'='*40}")

        drive = AliYunDrive(token)
        result = drive.sign()

        if result["status"] == "success":
            print(f" {result['message']}")
        else:
            print(f" {result['message']}")


if __name__ == "__main__":
    main()