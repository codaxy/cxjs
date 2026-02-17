# CxJS Skill for Claude Code

## Overview

CxJS Skill is a specialized Claude Code skill designed for working with the CxJS framework. It focuses on code quality, maintenance, and best practices.

## Features

### 1. Pattern Recognition
- Recognizes CxJS patterns in code (widgets, controllers, stores)
- Identifies anti-patterns and suggests improvements
- Detects opportunities for refactoring to idiomatic CxJS code

### 2. Component Generation
- Generates CxJS components following conventions
- Uses proper TypeScript types
- Implements proper data binding and lifecycle methods
- **Always wraps components with `createFunctionalComponent`**

### 3. Data Binding & Store Management
- Designs efficient store structures
- Implements proper accessor chains
- Sets up computed values using controllers

### 4. Debugging & Troubleshooting
- Identifies common CxJS issues
- Provides step-by-step debugging strategies
- References CxJS documentation and examples

## How to Use

### Locally

1. The skill is already configured in `.claude/commands/cxjs.md`
2. Invoke it with:
   ```
   /cxjs [your request]
   ```

### Usage Examples

**Analyzing existing code:**
```
/cxjs Analyze components in the gallery/ directory and suggest improvements
```

**Generating a new component:**
```
/cxjs Create a Grid component with CRUD operations for user management
```

**Debugging:**
```
/cxjs Help me debug why the binding isn't updating in the UserProfile component
```

**Refactoring:**
```
/cxjs Refactor this controller to use best practices for computed values
```

## Skill Structure

```
.claude/
└── commands/
    ├── cxjs.md          # Main skill definition
    └── README.md        # This documentation
```

## Publishing Preparation

To make the CxJS skill publicly available as a plugin, you need to:

### 1. Create Plugin Package

```json
{
  "name": "cxjs-skill",
  "version": "1.0.0",
  "description": "CxJS framework expert skill for code quality and maintenance",
  "main": "index.js",
  "keywords": ["cxjs", "claude-code", "skill", "framework"],
  "author": "Codaxy",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/codaxy/cxjs-skill"
  }
}
```

### 2. Create Plugin Manifest

```json
{
  "name": "cxjs-skill",
  "version": "1.0.0",
  "type": "skill",
  "description": "CxJS framework expert for code quality and maintenance",
  "capabilities": [
    "pattern-recognition",
    "code-generation",
    "debugging",
    "refactoring"
  ],
  "commands": {
    "cxjs": {
      "description": "Analyze, generate, or improve CxJS code with framework expertise",
      "prompt": "cxjs.md"
    }
  },
  "dependencies": {
    "claude-code": ">=1.0.0"
  }
}
```

### 3. Organize Files

```
cxjs-skill/
├── package.json
├── manifest.json
├── README.md
├── LICENSE
├── prompts/
│   └── cxjs.md           # Main skill prompt
├── examples/
│   ├── component-generation.md
│   ├── debugging.md
│   └── refactoring.md
└── docs/
    ├── installation.md
    └── usage.md
```

### 4. Testing

Before publishing, test the skill with different scenarios:
- [ ] Pattern recognition on existing CxJS code
- [ ] Generating new components (with `createFunctionalComponent`)
- [ ] Debugging common issues
- [ ] Refactoring complex structures
- [ ] Integration with TypeScript projects

### 5. Documentation for Publishing

Prepare:
- Detailed README.md with examples
- CHANGELOG.md for versioning
- CONTRIBUTING.md for the community
- Usage examples
- Video demonstration (optional)

### 6. Publishing

Distribution options:

#### A. Claude Plugin Registry (when available)
```bash
claude plugin publish
```

#### B. GitHub Package
```bash
git tag v1.0.0
git push origin v1.0.0
```

#### C. npm Package
```bash
npm publish
```

Users could then install with:
```bash
claude plugin install cxjs-skill
# or
claude plugin install codaxy/cxjs-skill
```

## Maintenance

- Regularly update the skill with new CxJS patterns
- Add new examples and use cases
- Implement user feedback
- Track CxJS releases and update best practices
- Ensure all component examples use `createFunctionalComponent`

## Contributing

The skill is open source and accepts contributions. Areas for improvement:
- More component templates (all using `createFunctionalComponent`)
- Additional debugging scenarios
- Performance optimization patterns
- Accessibility guidelines
- Internationalization examples

## Support

For questions and support:
- GitHub Issues: https://github.com/codaxy/cxjs
- Discord: https://discord.gg/cxjs
- Documentation: https://docs.cxjs.io

## License

MIT License - Feel free to use, modify and distribute.
