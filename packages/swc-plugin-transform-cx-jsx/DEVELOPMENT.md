# SWC CX JSX Transform Plugin - Development Guide

## 🚀 Quick Start

```bash
# Install dependencies (Rust toolchain required)
rustup target add wasm32-wasip1

# Build the plugin
make build-plugin

# Run tests
make test-plugin

# Check code
make check
```

## 📋 Available Make Targets

All commands are available via `make <target>`:

| Target | Command | Description |
|--------|---------|-------------|
| `build-plugin` | `cargo build --target wasm32-wasip1 --release` | Build optimized WASM plugin for production |
| `build-plugin-debug` | `cargo build --target wasm32-wasip1` | Build WASM plugin with debug symbols |
| `test-plugin` | `cargo test --target x86_64-unknown-linux-gnu` | Run all tests on native target |
| `test-plugin-all` | `cargo test --all-features --target x86_64-unknown-linux-gnu` | Run tests with all features enabled |
| `check` | `cargo check` | Quick check compilation without building |
| `check-wasm` | `cargo check --target wasm32-wasip1` | Check WASM target specifically |
| `clippy` | `cargo clippy --all-targets --all-features` | Run Clippy linter |
| `fmt` | `cargo fmt --all` | Format code with rustfmt |
| `fmt-check` | `cargo fmt --all -- --check` | Check code formatting |
| `clean` | `cargo clean` | Clean build artifacts |
| `copy-docs` | `cp README.md DEVELOPMENT.md DEBUG.md pkg/` | Copy docs to pkg/ |
| `copy-wasm` | `cp target/.../swc_plugin_*.wasm pkg/` | Copy WASM to pkg/ |
| `prepare-pkg` | `build-plugin + copy-wasm + copy-docs` | Build + prepare package for publishing |
| `watch` | `cargo watch -x 'check --target wasm32-wasip1'` | Watch mode for development |

## 🛠️ Prerequisites

### Required

1. **Rust Toolchain** (1.70+)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **WASM Target**
   ```bash
   rustup target add wasm32-wasip1
   ```

3. **Node.js** (for npm scripts)
   ```bash
   # Any recent version of Node.js
   node --version
   ```

### Optional (for development)

4. **cargo-watch** (for watch mode)
   ```bash
   cargo install cargo-watch
   ```

5. **wasm-pack** (for alternative builds)
   ```bash
   cargo install wasm-pack
   ```

## 🏗️ Building the Plugin

### Production Build

```bash
# Using npm script (recommended)
make build-plugin

# Or directly with cargo
cargo build --target wasm32-wasip1 --release
```

**Output location:**
```
target/wasm32-wasip1/release/swc_plugin_transform_cx_jsx.wasm
```

**Build time:** ~1-2 minutes (first build), ~10-30 seconds (incremental)

### Debug Build

```bash
make build-plugin:debug
```

**Output location:**
```
target/wasm32-wasip1/debug/swc_plugin_transform_cx_jsx.wasm
```

**Note:** Debug builds are larger and slower but include debug symbols for troubleshooting.

### Why WASM32-WASIP1 Target?

SWC plugins must be compiled to WebAssembly with WASI support:
- **wasm32-wasip1**: WebAssembly System Interface (WASI) target
- Required by SWC plugin system
- Allows plugin to run in any JavaScript runtime

## 🧪 Testing

### Run All Tests

```bash
make test-plugin
```

This runs **43 test cases** covering:
- JSX transformation
- Attribute handling
- Child element processing
- Import injection
- Functional components
- Edge cases

### Understanding Test Structure

Tests are located in `tests/` directory:
```
tests/
├── 00_formatting_non_cx_code/
│   ├── input.js
│   └── output.js
├── 01_transforms_empty_cx_to_null/
│   ├── input.js
│   └── output.js
...
```

Each test has:
- `input.js` or `input.tsx` - Input code
- `output.js` - Expected transformation result

### Adding New Tests

1. Create new directory in `tests/`:
   ```bash
   mkdir tests/44_my_new_test
   ```

2. Add input file:
   ```javascript
   // tests/44_my_new_test/input.js
   const x = <cx><div>Hello</div></cx>;
   ```

3. Add expected output:
   ```javascript
   // tests/44_my_new_test/output.js
   import { HtmlElement } from "cx/widgets";
   const x = {
     $type: HtmlElement,
     tag: "div",
     children: ["Hello"]
   };
   ```

4. Run tests:
   ```bash
   make test-plugin
   ```

### Why Test on Native Target?

```bash
cargo test --target x86_64-unknown-linux-gnu
```

- WASM tests can't run directly (no WASM runtime in test environment)
- Native target compiles the same Rust code for your machine
- Allows unit testing without WASM complexity
- Much faster test execution

## 🔍 Code Quality

### Check Compilation

```bash
# Quick check (no binary output)
make check

# Check WASM target specifically
make check:wasm
```

### Linting with Clippy

```bash
make clippy
```

Clippy catches common mistakes and suggests Rust best practices.

### Code Formatting

```bash
# Format code
make fmt

# Check if formatting is needed
make fmt:check
```

### Pre-commit Checklist

```bash
make fmt          # Format code
make clippy       # Lint code
make test-plugin  # Run tests
make build-plugin # Build release
```

## 🔧 Development Workflow

### 1. Making Changes

```bash
# Start watch mode (optional)
make watch

# Edit src/lib.rs
vim src/lib.rs

# Check compilation
make check
```

### 2. Testing Changes

```bash
# Run tests
make test-plugin

# If test fails, check output
cargo test --target x86_64-unknown-linux-gnu -- --nocapture
```

### 3. Building Release

```bash
# Clean build
make clean
make build-plugin
```

### 4. Testing in Real Project

#### Option A: Direct WASM Path (Quick Testing)

```bash
# After building
make build-plugin

# Use absolute path in your project's webpack/swc config
{
  jsc: {
    experimental: {
      plugins: [
        [
          "/absolute/path/to/cxjs/packages/swc-plugin-transform-cx-jsx/target/wasm32-wasip1/release/swc_plugin_transform_cx_jsx.wasm",
          { /* config */ }
        ]
      ]
    }
  }
}
```

#### Option B: Local Package (Full Testing)

```bash
# Prepare package
make prepare-pkg

# Install in test project
cd /path/to/test-project
npm install /path/to/cxjs/packages/swc-plugin-transform-cx-jsx/pkg

# Or use npm link
cd /path/to/cxjs/packages/swc-plugin-transform-cx-jsx/pkg
npm link
cd /path/to/test-project
npm link swc-plugin-transform-cx-jsx
```

#### Option C: Copy to node_modules (Quick Override)

```bash
# After building
make copy-wasm
make copy-docs

# Copy entire pkg to test project
cp -r pkg/* /path/to/project/node_modules/swc-plugin-transform-cx-jsx/
```

## 🐛 Debugging

### Enable Tracing in Tests

Add to test:
```rust
let debug_config = DebugConfig {
    enable_tracing: true,
    log_level: "debug".to_string(),
    log_transformations: true,
    log_imports: true,
    ..Default::default()
};
```

### Debug Print in Code

```rust
eprintln!("DEBUG: value = {:?}", some_value);
```

Note: Use `eprintln!` (stderr) not `println!` (stdout) in WASM context.

### Run Single Test

```bash
cargo test --target x86_64-unknown-linux-gnu -- test_name
```

### Check Test Output

```bash
cargo test --target x86_64-unknown-linux-gnu -- --nocapture
```

## 📊 Build Artifacts

### Directory Structure

```
swc-plugin-transform-cx-jsx/
├── src/
│   └── lib.rs              # Main plugin code
├── tests/                  # Test cases
├── target/
│   ├── wasm32-wasip1/
│   │   ├── debug/          # Debug WASM builds
│   │   └── release/        # Release WASM builds
│   └── x86_64-unknown-linux-gnu/
│       └── debug/          # Native test builds
├── Cargo.toml              # Rust package config
├── Cargo.lock              # Dependency lock file
├── package.json            # npm scripts
└── README.md               # User documentation
```

### Build Output Sizes

| Build Type | Size | Use Case |
|------------|------|----------|
| Debug WASM | ~5-8 MB | Development, debugging |
| Release WASM | ~1-2 MB | Production |
| Optimized WASM | ~500 KB - 1 MB | With wasm-opt |

### Optimizing WASM Size

Already enabled in `Cargo.toml`:
```toml
[profile.release]
codegen-units = 1
lto = true
strip = "symbols"
```

Additional optimization (optional):
```bash
# Install wasm-opt
npm install -g wasm-opt

# Optimize WASM
wasm-opt -Oz \
  target/wasm32-wasip1/release/swc_plugin_transform_cx_jsx.wasm \
  -o swc_plugin_transform_cx_jsx_optimized.wasm
```

## 📦 Packaging & Publishing

### Available Package Scripts

| Script | Description |
|--------|-------------|
| `copy-docs` | Copy README, DEVELOPMENT, and DEBUG docs to pkg/ |
| `copy-wasm` | Copy built WASM file to pkg/ |
| `prepare-pkg` | Build plugin + copy WASM + copy docs (all-in-one) |
| `prepublish` | Automatically runs before `npm publish` in pkg/ |

### Quick Package Preparation

```bash
# One command to prepare everything
make prepare-pkg
```

This will:
1. Build the optimized WASM plugin
2. Copy WASM file to `pkg/swc_plugin_transform_cx_jsx_bg.wasm`
3. Copy documentation files (README.md, DEVELOPMENT.md, DEBUG.md) to `pkg/`

### What Gets Published

The `pkg/` directory contains everything that gets published to npm:

```
pkg/
├── swc_plugin_transform_cx_jsx_bg.wasm  # The actual plugin
├── swc_plugin_transform_cx_jsx.js       # JS wrapper
├── swc_plugin_transform_cx_jsx_bg.js    # WASM loader
├── swc_plugin_transform_cx_jsx.d.ts     # TypeScript types
├── LICENSE.md                            # License
├── README.md                             # User guide (copied)
├── DEVELOPMENT.md                        # Dev guide (copied)
├── DEBUG.md                              # Debug guide (copied)
└── package.json                          # npm metadata
```

All files listed in `files` array in `pkg/package.json` will be included in the npm package.

## 🔄 Release Workflow

### 1. Version Bump

Update version in:
- `Cargo.toml` - Rust package version
- `pkg/package.json` - npm package version

```bash
# Example: bumping to 24.5.2
vim Cargo.toml        # Update version = "24.5.2"
vim pkg/package.json  # Update "version": "24.5.2"
```

### 2. Run Quality Checks

```bash
make clean
make fmt
make clippy
make test-plugin
```

### 3. Prepare Package

```bash
# This builds plugin, copies WASM, and copies docs
make prepare-pkg
```

### 4. Verify Package Contents

```bash
cd pkg
npm publish --dry-run
```

This shows what files will be published. Verify:
- ✅ WASM file is present and recent
- ✅ Documentation files are present
- ✅ Version number is correct
- ✅ File sizes look reasonable

### 5. Test Locally (Optional but Recommended)

```bash
# In pkg/ directory
npm pack

# This creates a .tgz file
# Install it in a test project:
cd /path/to/test-project
npm install /path/to/pkg/swc-plugin-transform-cx-jsx-24.5.2.tgz
```

### 6. Publish to npm

```bash
cd pkg
npm publish
```

The `prepublish` script will automatically run `prepare-pkg` before publishing.

### 7. Tag Release in Git

```bash
git tag v24.5.2
git push origin v24.5.2
```

## 🏷️ Cargo Profiles

### Debug Profile (default)
```bash
cargo build --target wasm32-wasip1
```
- Fast compilation
- Large binary
- Includes debug symbols
- No optimizations

### Release Profile
```bash
cargo build --target wasm32-wasip1 --release
```
- Slow compilation
- Small binary
- Stripped symbols
- Maximum optimizations

## 🔗 Useful Commands

### Check Rust Version
```bash
rustc --version
cargo --version
```

### Update Dependencies
```bash
cargo update
```

### View Dependency Tree
```bash
cargo tree
```

### Audit Dependencies
```bash
cargo audit
```

### Generate Documentation
```bash
cargo doc --open
```

### Clean Specific Target
```bash
cargo clean --target wasm32-wasip1
```

## 💡 Tips & Tricks

### Speed Up Compilation

1. **Use cargo-watch for development:**
   ```bash
   make watch
   ```

2. **Incremental compilation** (enabled by default in debug)

3. **Parallel compilation:**
   ```bash
   export CARGO_BUILD_JOBS=8
   ```

### Reduce WASM Size

1. Already optimized in release profile
2. Use `wasm-opt` for extra 10-20% reduction
3. Consider feature flags to exclude unused code

### Debug Performance Issues

1. Enable timing info:
   ```bash
   cargo build --target wasm32-wasip1 --release --timings
   ```

2. Check tracing output in real usage:
   ```bash
   RUST_LOG=trace node build.js 2> debug.log
   ```

## 📚 Additional Resources

- [SWC Plugin Documentation](https://swc.rs/docs/plugin/ecmascript/getting-started)
- [Rust WASM Book](https://rustwasm.github.io/book/)
- [SWC Core](https://github.com/swc-project/swc)
- [Plugin Debugging Guide](./DEBUG.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests: `make test-plugin`
5. Run linter: `make clippy`
6. Format code: `make fmt`
7. Build release: `make build-plugin`
8. Submit pull request

## ⚠️ Common Issues

### "target not found"
```bash
rustup target add wasm32-wasip1
```

### "linking with `rust-lld` failed"
```bash
rustup update
```

### Tests fail on WASM target
```bash
# Use native target instead
make test-plugin
```

### Out of memory during build
```bash
# Reduce parallel jobs
export CARGO_BUILD_JOBS=1
make build-plugin
```

## 📝 Notes

- Always build for `wasm32-wasip1` target for SWC plugins
- Test on native target (`x86_64-unknown-linux-gnu`) for speed
- Use debug builds during development
- Use release builds for distribution
- Keep `Cargo.lock` in version control
- Clean build directory occasionally to save space

---

**Happy Development! 🎉**

