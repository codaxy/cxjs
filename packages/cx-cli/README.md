# CxJS Command Line Interface

Modern CLI tool for scaffolding [CxJS](https://cxjs.io/) applications. Built with TypeScript and featuring an interactive UI powered by Clack.

## Features

- 🚀 **GitHub-based Templates** - Always up-to-date templates pulled directly from GitHub
- 💅 **Interactive UI** - Beautiful prompts powered by @clack/prompts
- 📦 **Multiple Templates** - Choose from basic, Tailwind, Material, and more
- 🎯 **Script Discovery** - Automatically displays available npm scripts after creation
- ⚡ **Modern Stack** - TypeScript, Vite, and latest CxJS 26.0.0+

## Installation

Install globally:

```bash
npm install -g cx-cli
```

Or use with npx (no installation required):

```bash
npx cx-cli create my-app
```

## Usage

### Create a new project

Interactive mode:

```bash
cx create
```

With options:

```bash
cx create my-app --template basic
```

Skip dependency installation:

```bash
cx create my-app --no-install
```

Dry run (see what would be created):

```bash
cx create my-app --dry-run
```

### Available Templates

- **basic** - Basic CxJS application template
- **tailwind** - CxJS with Tailwind CSS styling
- **codesandbox** - CodeSandbox compatible template
- **material-sidebar** - Material Design with sidebar navigation
- **phone-dark** - Mobile-optimized with dark theme

## Command Options

```
cx create [name] [options]

Options:
  -t, --template <template>  Template to use
  --dry-run                  Show what would be created without creating files
  -i, --install              Install dependencies after creation
  --no-install               Skip installing dependencies
  -h, --help                 Display help for command
```

## Requirements

- Node.js >= 18.0.0

## Development

```bash
# Install dependencies
yarn install

# Build the CLI
yarn build

# Run in development mode
yarn dev

# Test locally
node dist/cli.js create test-app
```

## Architecture

The CLI downloads templates directly from GitHub repositories, ensuring you always get the latest version. Templates are extracted and customized with your project name.

```
cx-cli/
├── src/
│   ├── cli.ts              # Entry point & command definitions
│   ├── commands/
│   │   ├── create.ts       # Project creation with interactive prompts
│   │   └── upgrade.ts      # CxJS upgrade command
│   ├── types/
│   │   └── templates.ts    # TypeScript interfaces
│   └── utils/
│       └── templates.ts    # Download & extraction utilities
└── app-templates.json      # Template configuration
```

## License

SEE LICENSE.md
