# Changelog

All notable changes to **Arc Calculator** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
