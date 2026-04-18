import json

svg_file = r'c:\myfile\bjp-yavatmal\public\yavatmal-map.svg'
with open(svg_file, 'r', encoding='utf-8') as f:
    content = f.read()

import re
paths = re.findall(r'<path id="(.*?)" d="(.*?)" fill="(.*?)"', content)

# #F36523 is saffron, #FDEEC1 is cream

clickable = []
non_clickable = []
taluka_paths = []

for pid, d, fill in paths:
    # fix id
    id_lower = pid.lower()
    if id_lower == 'near':
        id_lower = 'ner'
        
    is_click = fill == '#F36523'
    if is_click:
        clickable.append(id_lower)
    else:
        non_clickable.append(id_lower)
        
    taluka_paths.append(f'  "{id_lower}": "{d}",')

out = "export const TALUKA_PATHS: Record<string, string> = {\n" + "\n".join(taluka_paths) + "\n};\n"
out += f"export const CLICKABLE_TALUKAS_FROM_SVG = new Set({json.dumps(clickable)});\n"
out += f"export const NON_CLICKABLE_TALUKAS_FROM_SVG = new Set({json.dumps(non_clickable)});\n"

with open(r'c:\myfile\bjp-yavatmal\scratch_out.ts', 'w') as f:
    f.write(out)
