import json
import re
import random

# update mock-data.ts
with open('ui/lib/mock-data.ts', 'r', encoding='utf-8') as f:
    ts_content = f.read()

# Add properties to interface PropItem
ts_content = ts_content.replace('  dimensions?: string;\n  inStock: boolean;', '  dimensions?: string;\n  weight?: number;\n  pieces?: number;\n  condition?: string;\n  details?: string[];\n  inStock: boolean;')

conditions = ["Nuevo", "Excelente", "Bueno", "Vintage", "Desgastado"]

def add_props(match):
    obj_str = match.group(0)
    # Don't add twice if already there
    if 'weight:' in obj_str:
        return obj_str
        
    weight = round(random.uniform(0.5, 50.0), 1)
    pieces = random.randint(1, 5)
    condition = random.choice(conditions)
    details = json.dumps([
        "Material de alta calidad",
        "Ideal para producciones cinematográficas",
        f"Condición: {condition}",
        "Revisado por nuestro equipo de utilería"
    ], ensure_ascii=False)
    
    # Insert before inStock:
    replacement = f'    weight: {weight},\n    pieces: {pieces},\n    condition: "{condition}",\n    details: {details},\n    inStock:'
    return obj_str.replace('    inStock:', replacement)

ts_content = re.sub(r'\{[^{]*?inStock:[^}]*?\}', add_props, ts_content)

with open('ui/lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

# update mock_data.py
with open('package/props/handlers/mock_data.py', 'r', encoding='utf-8') as f:
    py_content = f.read()

def add_props_py(match):
    obj_str = match.group(0)
    if '"weight":' in obj_str:
        return obj_str
        
    weight = round(random.uniform(0.5, 50.0), 1)
    pieces = random.randint(1, 5)
    condition = random.choice(conditions)
    details = json.dumps([
        "Material de alta calidad",
        "Ideal para producciones cinematográficas",
        f"Condición: {condition}",
        "Revisado por nuestro equipo de utilería"
    ], ensure_ascii=False)
    
    replacement = f'    "weight": {weight},\n    "pieces": {pieces},\n    "condition": "{condition}",\n    "details": {details},\n    "inStock":'
    return obj_str.replace('    "inStock":', replacement)

py_content = re.sub(r'\{[^{]*?"inStock":[^}]*?\}', add_props_py, py_content)

with open('package/props/handlers/mock_data.py', 'w', encoding='utf-8') as f:
    f.write(py_content)
