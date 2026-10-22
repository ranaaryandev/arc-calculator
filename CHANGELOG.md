# Changelog

All notable changes to **Arc Calculator** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-23

### Added
- **Mathematical Precedence Rigor**: Conventional mathematical precedence where exponentiation binds tighter than unary minus (`-2^2 = -4`, `(-2)^2 = 4`, `2^3^2 = 512`, `2^-3 = 0.125`).
- **Binary Modulo & Functional Modulo**: Unambiguous binary `%` operator (`10 % 3 = 1`) alongside `mod(a, b)` function, cleanly distinguished from postfix percentage (`50% = 0.5`, `100 + 10% = 110`).
- **Strict Real-Domain Root Validation**: Enforced odd-integer root requirement for negative radicands (`root(3, -8) = -2`; `root(2, -8)` and `root(2.5, -32)` produce clear `DOMAIN_ERROR`).
- **Architectural Resource Limits**: Hard safety bounds against adversarial input: maximum input length of 1,000 characters (`INPUT_TOO_LONG`), maximum token count of 500 (`EXPRESSION_TOO_COMPLEX`), maximum parser/evaluator recursion depth of 40, and maximum consecutive unary operators of 20.
- **Undo / Redo Stack**: State history stack for expression editing with `Ctrl+Z` / `Ctrl+Y` shortcuts and visual status controls in the display.
- **Storage Failure Resilience**: Graceful recovery from full (`QuotaExceededError`), corrupted JSON, or disabled (`SecurityError`) `localStorage`.
- **Expanded Test Suite**: 103 tests across 6 suites plus 7 Playwright E2E tests covering regression, property-based identities, 50-case adversarial fuzzing, and UI interaction.

## [1.0.0] - 2026-10-22

### Added
- **Core AST Engine**: Safe tokenizer, recursive descent parser, and AST evaluator with zero `eval()` or dynamic script execution.
- **Scientific Operations**: Comprehensive suite including powers (`^`), square and cube roots, arbitrary roots, factorials (`!`), natural logarithms (`ln`), common logarithms (`log10`), base-2 logarithms (`log2`), absolute value (`abs`), and trigonometric/hyperbolic functions.
- **Angle Modes**: DEG and RAD modes with accurate handling of standard angles and tangent singularity protection (`tan(90°)`).
- **Persistent Calculation History**: Local-first calculation logs with search, click-to-reuse, formatted timestamps, and clear actions.
- **Tactile Keypad Experience**: Responsive grid layout with dedicated mobile standard/scientific tab views to preserve comfortable touch targets on narrow viewports.
- **Physical Keyboard Support**: Full keyboard input mapping for all operators, functions, and standard actions with a dedicated shortcuts guide (`?`).
- **Memory Operations**: Support for MC, MR, M+, M−, and MS with persistent visual indicators.
- **Educational Unit Converter**: Quick utility for angles, temperatures, lengths, and masses with direct insertion into calculations.
- **Dark & Light Themes**: Refined desktop utility aesthetic with design tokens and automatic system color-scheme detection.
- **Comprehensive Testing Suite**: 57 unit, integration, and UI tests covering essential mathematical formulas and edge cases.
