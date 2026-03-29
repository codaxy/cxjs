# CxJS Skill for Claude Code

> Modern TypeScript-first CxJS framework expert for Claude Code

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

CxJS Skill is a specialized Claude Code skill designed to help developers work effectively with the CxJS framework using modern, TypeScript-first patterns. It focuses on code quality, maintainability, and current best practices while avoiding outdated patterns.

## Key Features

### 🎯 TypeScript First
- All code generation in TypeScript with proper types
- Type-safe accessor chains and store bindings
- Interface definitions for props and data models
- No `any` types - leverages TypeScript's full power

### 🎨 Modern Layout Patterns
- **Avoids outdated FlexRow/FlexCol components**
- Automatically detects Tailwind CSS availability
- Uses Tailwind utility classes when available
- Falls back to modern CSS flexbox/grid patterns
- Semantic HTML and CSS-first approach

### 🔍 Intelligent Pattern Recognition
- Identifies outdated patterns in existing code
- Suggests modern refactoring approaches
- Detects anti-patterns and provides solutions
- Validates proper use of CxJS features

### 🛠️ Component Generation
- Generates functional components with TypeScript
- Proper data binding with typed accessors
- Controller setup for computed values
- Form validation and error handling
- Grid configurations with CRUD operations

### 💾 Store Management
- Typed store structures
- Namespaced organization
- Computed values via controllers
- Reactive binding patterns

### 🐛 Debugging Support
- Common CxJS issue identification
- Step-by-step debugging strategies
- Performance optimization suggestions
- TypeScript error resolution

## Installation

### Via Claude Code (when available)

```bash
claude plugin install @codaxy/cxjs-skill
```

### Manual Installation

1. Clone or download this repository
2. Copy `prompts/cxjs.md` to your project's `.claude/commands/` directory:

```bash
# From your project root
mkdir -p .claude/commands
cp /path/to/cxjs-skill/prompts/cxjs.md .claude/commands/
```

3. Restart Claude Code or reload the workspace

## Usage

Invoke the skill using the `/cxjs` command:

### Code Analysis
```
/cxjs Analyze the UserProfile component for improvements
```

### Component Generation
```
/cxjs Create a TypeScript Grid component with CRUD for managing users
```

### Refactoring
```
/cxjs Refactor this form to use modern patterns and TypeScript
```

### Debugging
```
/cxjs Why isn't my store binding updating the UI?
```

### Layout Migration
```
/cxjs Convert these FlexRow components to modern Tailwind layout
```

## What Makes This Skill Different

### Modern Standards
- **No FlexRow/FlexCol**: Uses modern CSS or Tailwind instead
- **TypeScript mandatory**: All code generation uses proper types
- **new.cxjs.io**: References the latest CxJS documentation
- **Smart detection**: Automatically adapts to your project setup

### Context-Aware
- Detects if Tailwind is available in your project
- Matches existing code conventions
- Suggests project-specific improvements
- Provides before/after examples

### Quality Focused
- Maintainable, readable code
- Proper error handling
- Performance considerations
- Accessibility awareness
- Self-documenting patterns

## Examples

### Before (Outdated Pattern)
```javascript
import { FlexRow } from 'cx/widgets';

export default <cx>
  <FlexRow spacing>
    <TextField value:bind="name" />
    <Button>Save</Button>
  </FlexRow>
</cx>
```

### After (Modern TypeScript + Tailwind)
```typescript
import { cx, TextField, Button } from 'cx/widgets';
import { bind } from 'cx/ui';

interface UserFormProps {
  onSave: () => void;
}

export const UserForm = ({ onSave }: UserFormProps) => (
  <cx>
    <div className="flex gap-4 items-center">
      <TextField value={bind("$page.user.name")} placeholder="Enter name" />
      <Button onClick={onSave} mod="primary">Save</Button>
    </div>
  </cx>
);
```

### TypeScript Controller
```typescript
import { Controller } from 'cx/ui';

interface UserData {
  firstName: string;
  lastName: string;
}

export class UserController extends Controller {
  onInit() {
    this.store.init<string>(
      "$page.fullName",
      this.computable("$page.user", (user: UserData) =>
        `${user.firstName} ${user.lastName}`.trim()
      )
    );
  }
}
```

See the [examples](./examples/) directory for more use cases.

## Documentation

- **CxJS Official Docs**: [new.cxjs.io](https://new.cxjs.io)
- **Framework Repository**: [github.com/codaxy/cxjs](https://github.com/codaxy/cxjs)
- **CxJS Gallery**: [cxjs.io/gallery](https://cxjs.io/gallery)

## Requirements

- Claude Code >= 1.0.0
- CxJS >= 23.0.0 (recommended)
- TypeScript >= 4.5.0
- Node.js >= 18.0.0

## What the Skill Does

### ✅ DO
- Generate TypeScript code with proper types
- Use Tailwind classes (if available) or modern CSS
- Create functional components
- Implement typed controllers
- Structure stores with namespaces
- Add accessibility attributes
- Provide error handling
- Suggest performance optimizations

### ❌ DON'T
- Use FlexRow or FlexCol components
- Generate JavaScript without types
- Use `any` type
- Inline complex logic in JSX
- Create flat store structures
- Ignore TypeScript errors
- Use outdated patterns

## Contributing

We welcome contributions! Areas for improvement:

- Additional TypeScript patterns
- More refactoring examples
- Performance best practices
- Accessibility guidelines
- Testing patterns

Please submit issues or pull requests on GitHub.

## Development

To modify this skill:

1. Edit `prompts/cxjs.md`
2. Test in a CxJS project using `/cxjs` command
3. Update examples if adding new capabilities
4. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/codaxy/cxjs-skill/issues)
- **CxJS Discord**: [discord.gg/cxjs](https://discord.gg/cxjs)
- **Documentation**: [new.cxjs.io](https://new.cxjs.io)

## Roadmap

- [ ] Integration with CxJS CLI tools
- [ ] Automated testing generation
- [ ] Component library scaffolding
- [ ] Performance profiling integration
- [ ] Migration scripts for legacy code

## License

MIT © [Codaxy](https://cxjs.io)

## Acknowledgments

Built for the CxJS community. Thanks to all contributors and the CxJS framework maintainers.

---

**Note**: This skill provides TypeScript-first, modern patterns for CxJS development. It automatically adapts to your project setup (Tailwind availability) and generates code following current best practices.

## Related Resources

- [CxJS Framework](https://github.com/codaxy/cxjs)
- [CxJS Documentation](https://new.cxjs.io)
- [CxJS Gallery](https://cxjs.io/gallery)
- [CxJS Fiddle](https://cxjs.io/fiddle)
