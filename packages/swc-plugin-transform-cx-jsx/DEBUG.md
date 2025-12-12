# SWC CX JSX Transform Plugin - Debugging & Tracing Guide

This plugin now includes comprehensive tracing and debugging capabilities to help you understand and troubleshoot JSX transformations.

## Features

- **Structured Logging**: Multi-level logging (trace, debug, info, warn, error)
- **Transformation Tracking**: See exactly what the plugin is doing at each step
- **Import Tracking**: Monitor when and how imports are being added
- **AST Inspection**: Optionally print AST before and after transformation
- **Better Error Handling**: Graceful error handling with detailed error messages instead of panics

## Configuration

Add a `debug` configuration object to your plugin options:

```javascript
{
  jsc: {
    experimental: {
      plugins: [
        [
          '@swc/plugin-transform-cx-jsx',
          {
            debug: {
              // Enable tracing output (default: false)
              enableTracing: true,
              
              // Log level: "trace" | "debug" | "info" | "warn" | "error" (default: "info")
              logLevel: "debug",
              
              // Print AST before transformation (default: false)
              printAstBefore: false,
              
              // Print AST after transformation (default: false)
              printAstAfter: false,
              
              // Log each transformation step (default: false)
              logTransformations: true,
              
              // Log import injection details (default: false)
              logImports: true
            }
          }
        ]
      ]
    }
  }
}
```

## Log Levels

### TRACE
Most detailed logging - shows every single operation
```json
{ "logLevel": "trace" }
```

### DEBUG
Detailed debugging information about transformations
```json
{ "logLevel": "debug" }
```

### INFO (Default)
General information about plugin execution
```json
{ "logLevel": "info" }
```

### WARN
Warning messages for potentially problematic situations
```json
{ "logLevel": "warn" }
```

### ERROR
Only error messages
```json
{ "logLevel": "error" }
```

## Common Use Cases

### Basic Debugging
See what the plugin is doing without overwhelming output:

```javascript
{
  debug: {
    enableTracing: true,
    logLevel: "info",
    logTransformations: true
  }
}
```

### Deep Debugging
Maximum verbosity for tracking down issues:

```javascript
{
  debug: {
    enableTracing: true,
    logLevel: "trace",
    logTransformations: true,
    logImports: true
  }
}
```

### Import Tracking
Focus on understanding import injection:

```javascript
{
  debug: {
    enableTracing: true,
    logLevel: "debug",
    logImports: true
  }
}
```

### AST Inspection
Examine the AST structure before and after transformation:

```javascript
{
  debug: {
    enableTracing: true,
    logLevel: "debug",
    printAstBefore: true,
    printAstAfter: true
  }
}
```

## Output Format

Logs are written to **stderr** in a structured format:

```
2025-12-12T10:30:45.123Z  INFO swc_plugin_transform_cx_jsx: Starting SWC CX JSX transformation plugin
2025-12-12T10:30:45.124Z DEBUG swc_plugin_transform_cx_jsx: Processing element with tag: div
2025-12-12T10:30:45.125Z  INFO swc_plugin_transform_cx_jsx: Transforming Cx container element: cx
2025-12-12T10:30:45.126Z DEBUG swc_plugin_transform_cx_jsx: Converting lowercase tag 'div' to HtmlElement
2025-12-12T10:30:45.127Z  INFO swc_plugin_transform_cx_jsx: Inserting import: HtmlElement from cx/widgets
```

## Environment Variables

You can also control tracing via the `RUST_LOG` environment variable:

```bash
# Set log level via environment
RUST_LOG=swc_plugin_transform_cx_jsx=debug npm run build

# Maximum verbosity
RUST_LOG=swc_plugin_transform_cx_jsx=trace npm run build

# Only errors
RUST_LOG=swc_plugin_transform_cx_jsx=error npm run build
```

## Performance Considerations

- **Production**: Keep `enableTracing: false` (default) for best performance
- **Development**: Enable tracing as needed for debugging
- **CI/CD**: Use `logLevel: "warn"` or `"error"` to reduce log noise

## Troubleshooting

### No logs appearing?

1. Make sure `enableTracing: true` is set
2. Check that you're looking at stderr (not stdout)
3. Verify log level is appropriate for the information you want

### Too much output?

1. Increase log level: `"trace"` → `"debug"` → `"info"`
2. Disable specific logging: set `logTransformations: false` or `logImports: false`
3. Focus on specific areas by adjusting individual flags

### Performance impact?

Tracing adds minimal overhead when disabled (default). When enabled:
- `logLevel: "info"` - negligible impact (~1-2%)
- `logLevel: "debug"` - small impact (~5-10%)
- `logLevel: "trace"` - moderate impact (~15-25%)

## Examples

### Example 1: Debug why an import isn't being added

```javascript
// webpack.config.js or similar
{
  debug: {
    enableTracing: true,
    logLevel: "debug",
    logImports: true
  }
}
```

Look for messages like:
```
DEBUG: Inserting import: HtmlElement from cx/widgets
INFO: Adding 1 import declarations
DEBUG: Creating import for symbols ["HtmlElement"] from 'cx/widgets'
```

### Example 2: Understand transformation flow

```javascript
{
  debug: {
    enableTracing: true,
    logLevel: "debug",
    logTransformations: true
  }
}
```

You'll see:
```
DEBUG: Processing element with tag: cx
INFO: Transforming Cx container element: cx
TRACE: Transforming expression of type: JSXElement
DEBUG: Found Cx tag, transforming element: cx
```

### Example 3: Production build with error logging only

```javascript
{
  debug: {
    enableTracing: true,
    logLevel: "error"
  }
}
```

Only critical errors will be logged.

## Advanced: Instrumentation Points

The plugin includes instrumentation at these key points:

- `transform_cx_element` - Main transformation logic
- `transform_cx_attribute` - JSX attribute processing
- `transform_cx_child` - Child element processing
- `insert_import` - Import injection
- `visit_mut_program` - Program-level transformation
- `visit_mut_jsx_element` - JSX element visiting
- `visit_mut_expr` - Expression transformation
- `visit_mut_call_expr` - Call expression handling
- `visit_mut_import_decl` - Import declaration processing

Each instrumentation point creates a tracing span that can be analyzed with tools like `tracing-subscriber`.

## Contributing

When adding new features or fixing bugs, please add appropriate tracing:

```rust
use tracing::{debug, info, trace, warn, error, instrument};

#[instrument(skip(self), level = "debug")]
fn my_function(&mut self, param: &str) {
    debug!("Processing: {}", param);
    
    if something_important {
        info!("Important event occurred");
    }
    
    if potential_issue {
        warn!("Potential issue detected");
    }
}
```

## See Also

- [Tracing Documentation](https://docs.rs/tracing/)
- [SWC Plugin Documentation](https://swc.rs/docs/plugin/ecmascript/getting-started)

