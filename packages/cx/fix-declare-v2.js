const fs = require('fs');
const path = require('path');
const glob = require('glob');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const lines = content.split('\n');
    const newLines = [];

    let inClass = false;
    let inInterface = false;
    let inReactComponent = false;
    let braceDepth = 0;
    let classStartDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Track interface boundaries
        if (trimmed.match(/^(export\s+)?interface\s+\w+/)) {
            inInterface = true;
            braceDepth = 0;
        }

        // Track class boundaries
        if (trimmed.match(/^(export\s+)?class\s+\w+/)) {
            inClass = true;
            classStartDepth = braceDepth;
            // Check if it's a React component
            inReactComponent = trimmed.includes('extends VDOM.Component') ||
                              trimmed.includes('extends React.Component') ||
                              trimmed.includes('extends Component');
        }

        // Track braces
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceDepth += openBraces - closeBraces;

        // Exit class/interface when we close the brace
        if (inClass && braceDepth <= classStartDepth && closeBraces > 0) {
            inClass = false;
            inReactComponent = false;
        }
        if (inInterface && braceDepth < 0) {
            inInterface = false;
        }

        // Check if this is a property line that needs declare
        if (inClass && !inInterface && !inReactComponent) {
            // Match: public/private/protected property without declare
            const match = trimmed.match(/^(public|private|protected)\s+(\w+)(\?)?:\s*(.+)/);

            if (match && !trimmed.includes('declare')) {
                const [, visibility, propName, optional, rest] = match;

                // Check if it has an initializer (= something)
                // We need to be careful here - the line might end with ; or might continue
                const hasInitializer = rest.includes('=');

                // Skip if it has an initializer
                if (!hasInitializer) {
                    // Skip certain method-like patterns
                    if (!rest.match(/^\s*\(/)) {
                        // Add declare
                        const indent = line.match(/^(\s*)/)[1];
                        newLines.push(`${indent}declare ${visibility} ${propName}${optional || ''}:${rest.split(':')[1] || rest}`);
                        modified = true;
                        continue;
                    }
                }
            }
        }

        newLines.push(line);
    }

    if (modified) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        return true;
    }

    return false;
}

// Find all .ts and .tsx files
const files = glob.sync('src/**/*.{ts,tsx}', {
    cwd: __dirname,
    absolute: true,
    ignore: ['**/*.d.ts', '**/*.spec.ts', '**/*.spec.tsx']
});

let modifiedCount = 0;
files.forEach(file => {
    if (processFile(file)) {
        console.log('Modified:', path.relative(__dirname, file));
        modifiedCount++;
    }
});

console.log(`\nModified ${modifiedCount} files`);
