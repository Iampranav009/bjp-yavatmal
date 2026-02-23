import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    changed = False
    for i, line in enumerate(lines):
        orig = line
        
        if filepath.endswith('layout.tsx') and '<body' in line:
            line = line.replace('bg-navy-dark', 'bg-slate-50')
            line = line.replace('text-white', 'text-slate-900')
        else:
            line = line.replace('bg-navy-dark', 'bg-[#f8fafc]')
            line = line.replace('bg-navy', 'bg-white')
            
            # Text changes
            keep_white = any(cls in line for cls in [
                'bg-saffron', 'bg-[#FCA311]', 'bg-[#FF5722]', 'bg-india-green', 
                'bg-black', 'from-black', 'to-black', 'bg-gradient-', 'from-[#060E1A]', 
                '"bg-black/50"'
            ])
            is_hero = 'HeroSlider' in filepath
            
            if not keep_white and not is_hero:
                line = line.replace('text-white/90', 'text-slate-800')
                line = line.replace('text-white/80', 'text-slate-700')
                line = line.replace('text-white/60', 'text-slate-600')
                line = line.replace('text-white/40', 'text-slate-500')
                line = line.replace('text-white/30', 'text-slate-400')
                line = line.replace('text-white', 'text-slate-900')
                
            line = line.replace('border-white/10', 'border-slate-200')
            line = line.replace('border-white/20', 'border-slate-200')
            line = line.replace('border-white/30', 'border-slate-300')
            line = line.replace('border-white/40', 'border-slate-300')
            line = line.replace('border-white/50', 'border-slate-400')
            line = line.replace('border-white', 'border-slate-300')
            
        if line != orig:
            lines[i] = line
            changed = True
            
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"Updated {filepath}")

for root, _, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
            
print("Done")
