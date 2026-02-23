const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walk(dirPath, callback);
        } else {
            if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
                callback(dirPath);
            }
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Handle layout.tsx specifically for body class
        if (filePath.endsWith('layout.tsx') && line.includes('<body className')) {
            line = line.replace('bg-navy-dark', 'bg-[#F4F6F8]');
            line = line.replace('text-white', 'text-slate-900');
            lines[i] = line;
            continue;
        }

        // Handle globals background
        line = line.replace(/bg-navy-dark/g, 'bg-[#F4F6F8]');
        line = line.replace(/bg-navy/g, 'bg-white');

        // Handle globals text
        // If line contains specific backgrounds that need white text, keep them!
        const keepsWhite = /(bg-saffron|bg-\[\#FCA311\]|bg-\[\#FF5722\]|bg-india-green|bg-black|from-black|to-black|bg-gradient-|from-\[\#060E1A\]|\"bg\-black\/50\")/.test(line);
        const isHeroOrAdminWait = filePath.includes('HeroSlider') && line.includes('text-white');

        if (!keepsWhite && !isHeroOrAdminWait) {
            line = line.replace(/text-white\/90/g, 'text-slate-800');
            line = line.replace(/text-white\/80/g, 'text-slate-700');
            line = line.replace(/text-white\/60/g, 'text-slate-600');
            line = line.replace(/text-white\/40/g, 'text-slate-500');
            line = line.replace(/text-white\/30/g, 'text-slate-400');
            line = line.replace(/text-white/g, 'text-slate-900');
        }

        // Ensure certain overlay or border uses slate values
        line = line.replace(/border-white\/10/g, 'border-slate-200');
        line = line.replace(/border-white\/20/g, 'border-slate-200');
        line = line.replace(/border-white\/30/g, 'border-slate-300');
        line = line.replace(/border-white\/40/g, 'border-slate-300');
        line = line.replace(/border-white\/50/g, 'border-slate-400');
        line = line.replace(/border-white(?!(\/|\]))/g, 'border-slate-300');

        // Fix up specific issues, for example if we accidentally changed something
        // Just keeping it simple

        lines[i] = line;
    }
    content = lines.join('\n');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + filePath);
    }
}

walk('./src', processFile);
console.log('Theme changed to light in all files');
