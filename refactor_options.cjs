const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
    // types.ts replacements
    { regex: /"Prelims CSAT"\s*\|?/g, replace: '' },
    { regex: /"Mains Essay"\s*\|?/g, replace: '' },
    { regex: /"Mains GS"\s*;/g, replace: '"Mains GS1" | "Mains GS2" | "Mains GS3" | "Mains GS4";' },
    { regex: /"Mains GS"\s*\|/g, replace: '"Mains GS1" | "Mains GS2" | "Mains GS3" | "Mains GS4" |' },
    
    // Arrays in UI
    { regex: /"Prelims CSAT",\s*/g, replace: '' },
    { regex: /"Mains Essay",?\s*/g, replace: '' },

    // JSX Select Options
    { regex: /<option value="Prelims GS1">.*?<\/option>/g, replace: '<option value="Prelims GS1">Prelims (GK & GS)</option>' },
    { regex: /<option value="Mains GS1">.*?<\/option>/g, replace: '<option value="Mains GS1">Mains Paper I</option>' },
    { regex: /<option value="Mains GS2">.*?<\/option>/g, replace: '<option value="Mains GS2">Mains Paper II</option>' },
    { regex: /<option value="Mains GS3">.*?<\/option>/g, replace: '<option value="Mains GS3">Mains Paper III</option>' },
    { regex: /<option value="Mains GS4">.*?<\/option>/g, replace: '<option value="Mains GS4">Mains Paper IV (Hindi/Eng)</option>' },
    { regex: /<option value="Prelims CSAT">.*?<\/option>\s*/g, replace: '' },
    { regex: /<option value="Mains Essay">.*?<\/option>\s*/g, replace: '' },
    { regex: /<option value="Mains GS">.*?<\/option>/g, replace: '<option value="Mains GS1">Mains Paper I</option>\\n<option value="Mains GS2">Mains Paper II</option>\\n<option value="Mains GS3">Mains Paper III</option>\\n<option value="Mains GS4">Mains Paper IV (Hindi/Eng)</option>' }
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
