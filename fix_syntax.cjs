const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

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
            
            // Delete lines with broken options
            content = content.replace(/.*<option value=>Prelims CSAT<\/option>.*/g, '');
            content = content.replace(/.*<option value=>Mains Essay<\/option>.*/g, '');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed syntax in: ' + fullPath);
            }
        }
    }
}

processDirectory(directoryPath);
