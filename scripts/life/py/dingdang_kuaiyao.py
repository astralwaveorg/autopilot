"""
叮当快药签到脚本

@Author: Astral
@Date: 2025-01-28
@Version: 1.0.0

环境变量:
   DINGDANGKUAIYAO_COOKIE: 叮当快药Cookie，多个账号用 &、\n 或 @ 分隔

参考文档: https://www.dingdangkuaiyao.com/
"""

import os
import requests
from typing import Optional


class Dingdangkuaiyao:
    """叮当快药签到类"""

    def __init__(self, cookie: str, index: int):
        self.cookie = cookie.strip()
        self.index = index
        self.nickname = ''

    def sign_in(self) -> bool:
        """执行签到"""
        try:
            response = requests.get(
                'https://www.dingdangkuaiyao.com/api/user/sign',
                headers={
                    'Cookie': self.cookie,
                    'Content-Type': 'application/json'
                }
            )

            res = response.json()

            if res.get('code') == 0 and res.get('data'):
                self.nickname = res['data'].get('nickname', f'账号{self.index + 1}')
                reward = res['data'].get('reward')

                if reward:
                    print(f'账号 {self.index + 1} [{self.nickname}] 签到成功')
                    print(f'   奖励: {reward.get("name")} {reward.get("desc")}')
                else:
                    print(f'账号 {self.index + 1} [{self.nickname}] 签到成功，无奖励')

                return True
            else:
                print(f'账号 {self.index + 1} 签到失败: {res.get("message", "未知错误")}')
                return False

        except Exception as error:
            print(f'账号 {self.index + 1} 签到异常: {str(error)}')
            return False

    def start(self) -> None:
        """启动签到"""
        print(f'\n========== 账号 {self.index + 1} ==========')

        if not self.cookie:
            print('Cookie为空')
            return

        self.sign_in()


def main():
    """主函数"""
    env_value = os.getenv('DINGDANGKUAIYAO_COOKIE', '')

    if not env_value:
        print('未找到环境变量 DINGDANGKUAIYAO_COOKIE')
        return

    # 解析多个账号
    users = []
    for sep in ['@', '\n', '&']:
        if sep in env_value:
            users = [u.strip() for u in env_value.split(sep) if u.strip()]
            break

    if not users:
        users = [env_value.strip()] if env_value.strip() else []

    # 执行签到
    for idx, user_config in enumerate(users):
        task = Dingdangkuaiyao(user_config, idx)
        task.start()


if __name__ == '__main__':
    main()