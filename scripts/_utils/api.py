#!/usr/bin/env python3
"""
AutoPilot 统一API请求库
"""
import requests
import os
import json
from typing import Optional, Dict, Any

class AutoPilotAPI:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'AutoPilot/1.0'
        })
    
    def get(self, url: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """GET请求"""
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"API请求失败: {e}")
            return {}

# 全局实例
api = AutoPilotAPI()
