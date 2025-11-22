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

    // Check if file has Widget or Container class
    if (!content.match(/extends\s+(Widget|Container|ContainerBase|PureContainer|Repeater|HtmlElement)/)) {
        return false;
    }

    // Skip .d.ts files
    if (filePath.endsWith('.d.ts')) {
        return false;
    }

    let modified = false;

    // Pattern to match property declarations WITHOUT initializers
    // Match: public/private/protected propertyName?: Type; or propertyName: Type;
    // Negative lookahead for = to skip properties with initializers
    const propertyPattern = /^(\s+)(public |private |protected )?([\w]+)(\??):\s*([^;\n]+?)(?=\s*;)/gm;

    content = content.replace(propertyPattern, (match, indent, visibility, propName, optional, type) => {
        // Skip if already has declare
        if (match.includes('declare')) {
            return match;
        }

        // Skip if this looks like it has an initializer (even though our regex shouldn't match it)
        // This is a safety check
        const fullLineMatch = content.match(new RegExp(`^${indent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]*${propName}[^\\n]*`, 'm'));
        if (fullLineMatch && fullLineMatch[0].includes('=')) {
            return match;
        }

        // Skip properties that should not have declare:
        // - Properties set in constructor
        // - Runtime state properties
        // - Callback/method properties (ending with ?)
        const skipProps = [
            'widgetId',
            'jsxSpread',
            'jsxAttributes',
            'initialized',
            'components',
            'helpers',
            'selector',
            'nameMap',
            'version',
            'isPureContainer',
            'isContent',
            'exploreCleanup',
            'prepareCleanup',
            'cleanup',
            'prepare',
            'recordsAccessor',
            'item',
            'filter',
            'onInit',
            'onExplore',
            'onPrepare',
            'onCleanup',
            'onDestroy'
        ];

        if (skipProps.includes(propName)) {
            return match;
        }

        // Skip if property name starts with 'on' and type looks like a function (callback)
        if (propName.startsWith('on') && type.includes('=>')) {
            return match;
        }

        // Add declare
        const vis = visibility || '';
        modified = true;
        return `${indent}declare ${vis}${propName}${optional}: ${type}`;
    });

    if (modified && content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
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
