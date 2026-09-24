const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
    { regex: /"Indian Polity & Governance"/g, replace: '"राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत"' },
    { regex: /"Indian Polity"/g, replace: '"राजस्थान का इतिहास, कला, संस्कृति, साहित्य, परम्परा एवं विरासत"' }
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            for (const {regex, replace} of replacements) {
                content = content.replace(regex, replace);
            }
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    }
}

processDirectory(directoryPath);
