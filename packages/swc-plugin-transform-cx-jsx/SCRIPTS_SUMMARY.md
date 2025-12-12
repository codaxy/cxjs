# SWC CX JSX Plugin - npm Scripts Summary

## 📋 Quick Reference

All commands use `npm run <script>`:

### 🏗️ Building

```bash
npm run build-plugin          # Production build (optimized WASM)
npm run build-plugin:debug    # Debug build (with symbols)
```

### 🧪 Testing

```bash
npm run test-plugin            # Run all 43 tests
npm run test-plugin:all        # Run tests with all features
```

### ✅ Code Quality

```bash
npm run check                  # Quick compilation check
npm run check:wasm             # Check WASM target
npm run clippy                 # Lint with Clippy
npm run fmt                    # Format code
npm run fmt:check              # Check formatting
```

### 📦 Packaging

```bash
npm run copy-docs              # Copy docs to pkg/
npm run copy-wasm              # Copy WASM to pkg/
npm run prepare-pkg            # Build + copy everything
```

### 🔧 Maintenance

```bash
npm run clean                  # Clean build artifacts
npm run watch                  # Watch mode for development
```

## 🚀 Common Workflows

### Daily Development

```bash
# Start watch mode
npm run watch

# In another terminal, run tests when ready
npm run test-plugin
```

### Before Commit

```bash
npm run fmt
npm run clippy
npm run test-plugin
```

### Prepare for Release

```bash
npm run clean
npm run test-plugin
npm run clippy
npm run prepare-pkg

cd pkg
npm publish --dry-run  # Verify
npm publish             # Ship it!
```

### Quick Test in Another Project

```bash
npm run build-plugin

# Then use absolute path in that project's config
"/absolute/path/to/.../target/wasm32-wasip1/release/swc_plugin_transform_cx_jsx.wasm"
```

## 📁 What Goes Where

### Development Files (not published)

```
swc-plugin-transform-cx-jsx/
├── src/lib.rs              # Source code
├── Cargo.toml              # Rust config
├── package.json            # Development scripts
├── README.md               # Main documentation
├── DEVELOPMENT.md          # This guide
├── DEBUG.md                # Debugging guide
└── tests/                  # Test cases
```

### Published Package (pkg/)

```
pkg/
├── swc_plugin_transform_cx_jsx_bg.wasm   # Built plugin
├── package.json                           # npm metadata
├── README.md                              # Copied from root
├── DEVELOPMENT.md                         # Copied from root
└── DEBUG.md                               # Copied from root
```

## 🎯 Script Details

### `build-plugin`
- **Command:** `cargo build --target wasm32-wasip1 --release`
- **Output:** `target/wasm32-wasip1/release/swc_plugin_transform_cx_jsx.wasm`
- **Time:** 1-2 min first build, 10-30s incremental
- **Use:** Production-ready optimized WASM

### `test-plugin`
- **Command:** `cargo test --target x86_64-unknown-linux-gnu`
- **Runs:** 43 test cases
- **Time:** ~5-10 seconds
- **Use:** Verify transformations work correctly

### `prepare-pkg`
- **Runs:** `build-plugin` → `copy-wasm` → `copy-docs`
- **Result:** Ready-to-publish `pkg/` directory
- **Use:** Prepare for npm publish

### `copy-docs`
- **Copies:** README.md, DEVELOPMENT.md, DEBUG.md → pkg/
- **Use:** Include documentation in npm package

### `copy-wasm`
- **Copies:** Built WASM → `pkg/swc_plugin_transform_cx_jsx_bg.wasm`
- **Use:** Manual WASM update to pkg/

## 💡 Tips

### Speed Up Development

```bash
# Watch mode runs check automatically
npm run watch

# Skip full build during development
npm run check
```

### Test Specific Case

```bash
cargo test --target x86_64-unknown-linux-gnu -- test_name
```

### Check What Will Be Published

```bash
cd pkg
npm publish --dry-run
```

### Clean Everything

```bash
npm run clean
rm -rf pkg/*.md pkg/*.wasm  # Clean copied files
```

## 🔄 Typical Development Cycle

1. **Make changes** to `src/lib.rs`
2. **Check** compilation: `npm run check`
3. **Test** changes: `npm run test-plugin`
4. **Format** code: `npm run fmt`
5. **Lint** code: `npm run clippy`
6. **Build** release: `npm run build-plugin`
7. **Test** in real project (use absolute path or `npm link`)

## 📦 Typical Release Cycle

1. **Update** versions in `Cargo.toml` and `pkg/package.json`
2. **Clean** build: `npm run clean`
3. **Test**: `npm run test-plugin`
4. **Lint**: `npm run clippy`
5. **Prepare**: `npm run prepare-pkg`
6. **Verify**: `cd pkg && npm publish --dry-run`
7. **Publish**: `cd pkg && npm publish`
8. **Tag**: `git tag vX.Y.Z && git push origin vX.Y.Z`

## ⚠️ Important Notes

- Always use `wasm32-wasip1` target for builds
- Always use native target for tests (faster, can't run WASM tests directly)
- `prepare-pkg` automatically runs before `npm publish` via `prepublish`
- Documentation files are auto-copied to `pkg/` before publishing
- WASM file must be named `swc_plugin_transform_cx_jsx_bg.wasm` in pkg/

## 🆘 Troubleshooting

### "target not found"
```bash
rustup target add wasm32-wasip1
```

### Scripts not found
```bash
# Make sure you're in the plugin directory
cd packages/swc-plugin-transform-cx-jsx
npm run build-plugin
```

### Docs not showing up in package
```bash
# Run prepare-pkg to copy everything
npm run prepare-pkg

# Verify files array in pkg/package.json includes:
# "README.md", "DEVELOPMENT.md", "DEBUG.md"
```

### Old WASM file being used
```bash
npm run clean
npm run prepare-pkg
```

## 📚 More Information

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Complete development guide
- [DEBUG.md](./DEBUG.md) - Debugging and tracing guide
- [README.md](./README.md) - User documentation

---

**Need help?** Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed information.

