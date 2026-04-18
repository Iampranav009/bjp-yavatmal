import json

html_file = r'c:\myfile\bjp-yavatmal\yavatmal_district_interactive_map.html'
with open(html_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

result = []
for i, line in enumerate(lines):
    if '<path id=' in line:
        id_val = line.split('id="')[1].split('"')[0]
        clickable = line.split('data-clickable="')[1].split('"')[0]
        # The next line contains the d attribute
        d_line = lines[i+1]
        if 'd="' in d_line:
            d_val = d_line.split('d="')[1].split('"')[0]
            is_clickable = 'true' if clickable == 'true' else 'false'
            real_id = 'darwha' if id_val == 'west' else id_val
            result.append(f'{{ id: "{real_id}", isClickable: {is_clickable}, pathData: "{d_val}" }}')

output_path = r'c:\myfile\bjp-yavatmal\scratch_data.js'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('export const svgPaths = [\n  ' + ',\n  '.join(result) + '\n];')

print('Wrote to scratch_data.js successfully.')
