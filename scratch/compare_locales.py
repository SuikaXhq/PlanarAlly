import json
import os
import sys

# Ensure UTF-8 output even on Windows
sys.stdout.reconfigure(encoding='utf-8')

en_path = r"d:\WorkSpace\PlanarAlly\client\src\locales\en.json"
zh_path = r"d:\WorkSpace\PlanarAlly\client\src\locales\zh.json"

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open(zh_path, 'r', encoding='utf-8') as f:
    zh_data = json.load(f)

def get_missing_keys(source, target):
    missing = {}
    for key, value in source.items():
        if key not in target:
            missing[key] = value
        elif isinstance(value, dict):
            if not isinstance(target[key], dict):
                missing[key] = value
            else:
                nested_missing = get_missing_keys(value, target[key])
                if nested_missing:
                    missing[key] = nested_missing
    return missing

missing_fields = get_missing_keys(en_data, zh_data)

with open(r"d:\WorkSpace\PlanarAlly\scratch\missing_fields.json", 'w', encoding='utf-8') as f:
    json.dump(missing_fields, f, ensure_ascii=False, indent=4)

print(f"Total missing structure nodes: {len(missing_fields)}")
