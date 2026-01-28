#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
emoji
"""

import os
import re

# emoji
EMOJI_PATTERNS = [
    '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '',
]

def clean_file(file_path):
    """"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        for emoji in EMOJI_PATTERNS:
            content = content.replace(emoji, '')

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

        return False
    except Exception as e:
        print(f' {file_path}: {e}')
        return False

def main():
    """"""
    scripts_dir = os.path.join(os.path.dirname(__file__), '../../')

    cleaned_count = 0
    total_files = 0

    for root, dirs, files in os.walk(scripts_dir):
        for file in files:
            if file.endswith(('.js', '.ts', '.py')):
                file_path = os.path.join(root, file)
                total_files += 1
                if clean_file(file_path):
                    cleaned_count += 1
                    print(f': {file_path}')

    print(f'\n:  {total_files}  {cleaned_count} ')

if __name__ == '__main__':
    main()