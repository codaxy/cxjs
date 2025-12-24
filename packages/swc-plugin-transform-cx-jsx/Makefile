# SWC CX JSX Transform Plugin - Build Commands
# Usage: make <target>

.PHONY: help build-plugin build-plugin-debug test-plugin test-plugin-all check check-wasm clippy fmt fmt-check clean copy-docs copy-wasm prepare-pkg watch

# Default target
help:
	@echo "Available targets:"
	@echo "  build-plugin       - Build optimized WASM plugin"
	@echo "  build-plugin-debug - Build WASM plugin with debug symbols"
	@echo "  test-plugin        - Run all tests"
	@echo "  test-plugin-all    - Run tests with all features"
	@echo "  check              - Quick compilation check"
	@echo "  check-wasm         - Check WASM target"
	@echo "  clippy             - Run Clippy linter"
	@echo "  fmt                - Format code"
	@echo "  fmt-check          - Check code formatting"
	@echo "  clean              - Clean build artifacts"
	@echo "  copy-docs          - Copy docs to pkg/"
	@echo "  copy-wasm          - Copy WASM to pkg/"
	@echo "  prepare-pkg        - Build + copy everything"
	@echo "  watch              - Watch mode for development"

# Build targets
build-plugin:
	cargo build --target wasm32-wasip1 --release

build-plugin-debug:
	cargo build --target wasm32-wasip1

# Test targets
test-plugin:
	cargo test --target x86_64-unknown-linux-gnu

test-plugin-all:
	cargo test --all-features --target x86_64-unknown-linux-gnu

# Check targets
check:
	cargo check

check-wasm:
	cargo check --target wasm32-wasip1

# Code quality
clippy:
	cargo clippy --all-targets --all-features

fmt:
	cargo fmt --all

fmt-check:
	cargo fmt --all -- --check

# Cleanup
clean:
	cargo clean

# Packaging
copy-docs:
	cp README.md DEVELOPMENT.md DEBUG.md pkg/

copy-wasm:
	cp target/wasm32-wasip1/release/swc_plugin_transform_cx_jsx.wasm pkg/swc_plugin_transform_cx_jsx_bg.wasm

prepare-pkg: build-plugin copy-wasm copy-docs
	@echo "Package prepared in pkg/"

# Development
watch:
	cargo watch -x 'check --target wasm32-wasip1'

