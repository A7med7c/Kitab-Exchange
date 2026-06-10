const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(getFiles(file));
        } else if (file.endsWith('.ts') || file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const files = getFiles('src');
const keys = new Set();
const regex1 = /'([a-zA-Z0-9_.]+)'\s*\|\s*translate/g;
const regex2 = /"([a-zA-Z0-9_.]+)"\s*\|\s*translate/g;
const regex3 = /translate\.instant\('([a-zA-Z0-9_.]+)'\)/g;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = regex1.exec(content)) !== null) {
        keys.add(match[1]);
    }
    while ((match = regex2.exec(content)) !== null) {
        keys.add(match[1]);
    }
    while ((match = regex3.exec(content)) !== null) {
        keys.add(match[1]);
    }
});

const en = JSON.parse(fs.readFileSync('public/assets/i18n/en.json', 'utf8'));

function hasKey(obj, path) {
    const parts = path.split('.');
    let curr = obj;
    for (const p of parts) {
        if (!curr || !(p in curr)) return false;
        curr = curr[p];
    }
    return true;
}

const missing = [];
keys.forEach(k => {
    if (!hasKey(en, k)) missing.push(k);
});

console.log('Missing keys:', missing);
