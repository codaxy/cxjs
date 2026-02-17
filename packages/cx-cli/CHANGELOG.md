# Changelog

## [26.1.1] - 2026-01-28

### 🚀 Complete Rewrite

Complete modernization of cx-cli with breaking changes.

### ✨ Added

- **TypeScript**: Full TypeScript rewrite for better type safety
- **Modern UI**: Interactive prompts powered by @clack/prompts
- **GitHub Templates**: Templates downloaded directly from GitHub repositories
- **Script Discovery**: Automatically displays available npm scripts after project creation
- **Native Fetch**: Uses Node.js 18+ built-in fetch API (no external HTTP libraries)
- **Better Error Handling**: Clear error messages for network, extraction, and validation errors
- **Dry Run Mode**: Test project creation without downloading templates

### 🔄 Changed

- **BREAKING**: Minimum Node.js version raised to 18.0.0 (from 6.0.0)
- **BREAKING**: Changed from local templates to GitHub-hosted templates
- **BREAKING**: Removed `cx add route` command
- **BREAKING**: Changed from CommonJS to ES Modules
- Binary command remains `cx` for backward compatibility
- Updated all dependencies to latest versions

### 🗑️ Removed

- Deprecated `request` library (replaced with native fetch)
- `chalk` (replaced with `picocolors`)
- `cli-select` (replaced with `@clack/prompts`)
- `copy-dir` (replaced with `adm-zip` for template extraction)
- Local `templates/` directory
- Route scaffolding feature

### 📦 Technical Changes

- Build tool: tsup (modern TypeScript bundler)
- Package structure: Now includes `src/`, built to `dist/`
- Template configuration: External `app-templates.json` file
- Always downloads fresh templates from GitHub

### 🔧 Dependencies

**Added:**
- @clack/prompts ^0.11.0
- picocolors ^1.1.1
- fs-extra ^11.3.3
- commander ^14.0.2 (updated)
- adm-zip ^0.5.16 (retained)

**Removed:**
- request
- chalk
- cli-select
- copy-dir

### 📋 Migration Guide

If upgrading from 23.x:

1. Ensure Node.js >= 18.0.0
2. Update global installation: `npm install -g cx-cli`
3. Command usage remains the same: `cx create my-app`
4. Templates are now auto-downloaded from GitHub (no local templates)
5. `cx add route` command has been removed

---

## [23.12.1] - Previous Release

Last version of the original JavaScript implementation.
