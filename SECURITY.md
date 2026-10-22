# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Model & Sandboxing

Arc Calculator is designed with security and safety as top priorities:

1. **Zero `eval()` or Dynamic Code Execution**: User input is strictly tokenized and evaluated using a custom Abstract Syntax Tree (AST) evaluator. Under no circumstances is user input passed to JavaScript `eval()`, `new Function()`, or injected into HTML.
2. **Grammar & Token Whitelist**: Only validated numeric literals, mathematical constants (`pi`, `e`), defined operators (`+`, `-`, `*`, `/`, `^`, `%`, `!`), and whitelisted mathematical functions are recognized.
3. **Strict Execution & Resource Bounds**:
   - Maximum input length: 1,000 characters (`INPUT_TOO_LONG`)
   - Maximum token count: 500 tokens (`EXPRESSION_TOO_COMPLEX`)
   - Maximum parser & evaluator recursion depth: 40 levels (`EXPRESSION_TOO_COMPLEX`)
   - Maximum consecutive unary operators: 20 (`EXPRESSION_TOO_COMPLEX`)
   - Factorial parameter limit: $\le 170$ to prevent floating-point overflow (`OVERFLOW`)
4. **Local-First & Zero Telemetry**: The application runs 100% locally in your browser. No calculations, history, or telemetry are ever sent to an external server or third-party service. Zero external network requests (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`).

## Reporting a Vulnerability

If you discover any security issues, please report them responsibly by opening a private GitHub Security Advisory or contacting the maintainers directly via repository issue marked `[Security]`.
