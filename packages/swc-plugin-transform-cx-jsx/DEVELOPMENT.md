# SWC CX JSX Transform Plugin - Development Guide

## 🚀 Quick Start

```bash
# Install dependencies (Rust toolchain required)
rustup target add wasm32-wasip1

# Build the plugin
npm run build-plugin

# Run tests
npm run test-plugin

# Check code
npm run check
```

## 📋 Available Scripts

All scripts are available via `npm run <script>`:

| Script | Command | Description |
|--------|---------|-------------|
| `build-plugin` | `cargo build --target wasm32-wasip1 --release` | Build optimized WASM plugin for production |
| `build-plugin:debug` | `cargo build --target wasm32-wasip1` | Build WASM plugin with debug symbols |
| `test-plugin` | `cargo test --target x86_64-unknown-linux-gnu` | Run all tests on native target |
| `test-plugin:all` | `cargo test --all-features --target x86_64-unknown-linux-gnu` | Run tests with all features enabled |
| `check` | `cargo check` | Quick check compilation without building |
| `check:wasm` | `cargo check --target wasm32-wasip1` | Check WASM target specifically |
| `clippy` | `cargo clippy --all-targets --all-features` | Run Clippy linter |
| `fmt` | `cargo fmt --all` | Format code with rustfmt |
| `fmt:check` | `cargo fmt --all -- --check` | Check code formatting |
| `clean` | `cargo clean` | Clean build artifacts |
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
npm run build-plugin

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
npm run build-plugin:debug
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
npm run test-plugin
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
   npm run test-plugin
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
npm run check

# Check WASM target specifically
npm run check:wasm
```

### Linting with Clippy

```bash
npm run clippy
```

Clippy catches common mistakes and suggests Rust best practices.

### Code Formatting

```bash
# Format code
npm run fmt

# Check if formatting is needed
npm run fmt:check
```

### Pre-commit Checklist

```bash
npm run fmt          # Format code
npm run clippy       # Lint code
npm run test-plugin  # Run tests
npm run build-plugin # Build release
```

## 🔧 Development Workflow

### 1. Making Changes

```bash
# Start watch mode (optional)
npm run watch

# Edit src/lib.rs
vim src/lib.rs

# Check compilation
npm run check
```

### 2. Testing Changes

```bash
# Run tests
npm run test-plugin

# If test fails, check output
cargo test --target x86_64-unknown-linux-gnu -- --nocapture
```

### 3. Building Release

```bash
# Clean build
npm run clean
npm run build-plugin
```

### 4. Testing in Real Project

```bash
# After building, copy WASM file
cp target/wasm32-wasip1/release/swc_plugin_transform_cx_jsx.wasm \
   /path/to/project/node_modules/swc-plugin-transform-cx-jsx/

# Or use local path in config
{
  jsc: {
    experimental: {
      plugins: [
        [
          "/absolute/path/to/swc_plugin_transform_cx_jsx.wasm",
          { /* config */ }
        ]
      ]
    }
  }
}
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

## 🔄 Release Workflow

### 1. Version Bump

Update version in:
- `Cargo.toml` - Rust package version
- `pkg/package.json` - npm package version

### 2. Build Release

```bash
npm run clean
npm run test-plugin
npm run clippy
npm run build-plugin
```

### 3. Copy to Package

```bash
cp target/wasm32-wasip1/release/swc_plugin_transform_cx_jsx.wasm pkg/
```

### 4. Test Package

```bash
cd pkg
npm publish --dry-run
```

### 5. Publish

```bash
cd pkg
npm publish
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
   npm run watch
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
4. Run tests: `npm run test-plugin`
5. Run linter: `npm run clippy`
6. Format code: `npm run fmt`
7. Build release: `npm run build-plugin`
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
npm run test-plugin
```

### Out of memory during build
```bash
# Reduce parallel jobs
export CARGO_BUILD_JOBS=1
npm run build-plugin
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

