const fs = require('fs');
const path = require('path');

function findTsFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'build' && entry.name !== 'dist') {
            findTsFiles(fullPath, files);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
            files.push(fullPath);
        }
    }

    return files;
}

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    let modified = false;

    // Remove declare from interface properties
    // Match patterns like: "   declare propertyName: Type;" inside interfaces
    const lines = content.split('\n');
    let inInterface = false;
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Track if we're inside an interface
        if (line.match(/^\s*export\s+interface\s+/) || line.match(/^\s*interface\s+/)) {
            inInterface = true;
            braceCount = 0;
        }

        if (inInterface) {
            // Count braces to know when interface ends
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            braceCount += openBraces - closeBraces;

            // If we find a line with "declare" inside an interface, remove it
            if (line.includes('declare ') && braceCount > 0) {
                lines[i] = line.replace(/(\s+)declare\s+/, '$1');
                modified = true;
            }

            // Check if interface ended
            if (braceCount === 0 && line.includes('}')) {
                inInterface = false;
            }
        }
    }

    // Remove declare from inside functions/methods (like "declare default:")
    for (let i = 0; i < lines.length; i++) {
        // Match "declare default:" which is clearly wrong
        if (lines[i].match(/^\s+declare\s+default:/)) {
            lines[i] = lines[i].replace(/declare\s+/, '');
            modified = true;
        }
    }

    if (modified) {
        const newContent = lines.join('\n');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Fixed: ${filePath}`);
        return true;
    }

    return false;
}

function main() {
    const srcDir = path.join(__dirname, 'src');
    const files = findTsFiles(srcDir);

    let fixedCount = 0;

    for (const file of files) {
        try {
            if (fixFile(file)) {
                fixedCount++;
            }
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    }

    console.log(`\nFixed ${fixedCount} files`);
}

main();
