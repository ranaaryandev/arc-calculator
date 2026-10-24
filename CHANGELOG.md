# Changelog

All notable changes to **Arc Calculator** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-24

### Added
- **Physical Calculator Mode Paradigm (fx-991CW Inspired)**:
  - Global `[MODE]` button in header and modal selector (`ModeSelectorModal.tsx`) with 11 dedicated functional modes and numbered physical shortcuts (1–9).
  - Mode switching with clean `[← Back to Calculator]` breadcrumb navigation that preserves underlying calculator memory and state.
- **Dedicated Analytical Equation Solvers**:
  - Quadratic Equation Solver ($ax^2 + bx + c = 0$): Discriminant analysis ($\Delta$), real roots, complex conjugate roots ($u \pm vi$), and vertex coordinates $(h, k)$.
  - Linear Single-Variable Solver ($ax + b = 0$).
  - $2 \times 2$ Linear Systems Solver: Cramer's rule determinant method with singular matrix detection.
  - $3 \times 3$ Linear Systems Solver: Full Gaussian elimination with partial pivoting and back-substitution.
- **Matrix & Linear Algebra Engine**:
  - $2 \times 2$ and $3 \times 3$ interactive matrix inputs with operations: Matrix Addition ($A + B$), Subtraction ($A - B$), Multiplication ($A \times B$), Scalar Multiplication ($k \cdot A$), Transpose ($A^T$), Determinant ($\det(A)$), Trace ($\text{tr}(A)$), and Gauss-Jordan Matrix Inversion ($A^{-1}$) with singularity checks.
- **2D & 3D Vector Mechanics**:
  - Magnitude calculation ($\|v\|$), vector addition ($u+v$), subtraction ($u-v$), dot product ($u \cdot v$), 3D cross product ($u \times v$), unit normalization ($\hat{u}$), angle between vectors ($\theta$), and vector projection ($\text{proj}_v u$).
- **Complex Number Engine**:
  - Rectangular ($a + bi$) and Polar ($r \angle \theta$) dual-representation support with synchronized conversions.
  - Addition, subtraction, multiplication, division, modulus ($|z|$), principal argument ($\text{Arg}(z)$ in degrees and radians), complex conjugate ($\bar{z}$), and integer exponentiation via De Moivre's Theorem ($z^n = r^n (\cos n\theta + i \sin n\theta)$).
- **Engineering Statistics & Probability Solvers**:
  - 1-Variable Summary Statistics: $n$, $\sum x$, $\sum x^2$, arithmetic mean ($\bar{x}$), median, mode, sample variance ($s^2$), population variance ($\sigma^2$), sample standard deviation ($s$), population standard deviation ($\sigma$), min, max, range, and quartiles ($Q_1, Q_3, IQR$).
  - 2-Variable Linear Regression: Least squares slope ($m$), intercept ($c$), Pearson correlation coefficient ($r$), and coefficient of determination ($r^2$).
  - Probability & Combinatorics: Permutations ($nPr$), Combinations ($nCr$), Factorials ($n!$), Binomial PMF & CDF ($B(n, p)$), and Normal PDF & CDF with Abramowitz & Stegun error function approximation.
- **Computer Science & Digital Logic (Base-N)**:
  - Synchronous multi-base conversion across Decimal, Binary, Octal, and Hexadecimal.
  - Bitwise operations: `AND`, `OR`, `XOR`, `NOT`, Left Shift (`SHL`), and Right Shift (`SHR`).
  - Configurable word sizes (8-bit, 16-bit, 32-bit) with signed two's complement interpretation.
- **Function Table Generator**:
  - Tabular evaluation of $f(x)$ across user-defined $[x_{\text{start}}, x_{\text{end}}]$ and step intervals, with asymptotic discontinuity detection and 500-row safety bounds.
- **University Engineering Toolkit**:
  - 12 verified engineering calculators across 4 core disciplines (Electrical, Mechanical, Civil, Computer) with live parameter updates, SI units, and worked formula steps:
    - *Electrical*: Ohm's Law & DC Power ($V, I, R, P$), Voltage Divider Rule, Series & Parallel Resistors, RC Time Constant & Cutoff Frequency ($f_c$), AC Series RLC Reactance & Impedance ($Z$).
    - *Mechanical*: Newton's Second Law ($F=ma$), Stress, Strain & Young's Modulus ($E$), Mechanical Torque ($\tau$), Kinetic & Gravitational Potential Energy, Thermal Linear Expansion ($\Delta L$).
    - *Civil*: Concrete Slab & Footing Volume Estimator, Simply Supported Beam Max Moment & Shear ($wL^2/8$, $wL/2$), Slope, Grade & Incline Angle.
    - *Computer*: Two's Complement Integer Converter, Data Storage Unit Converter (Decimal SI vs. Binary IEC).
- **Expanded Unit Converter**:
  - Added 4 engineering domains: Pressure (Pa, kPa, MPa, bar, psi, atm, mmHg), Energy (J, kJ, cal, kcal, Wh, kWh, BTU, eV), Power (W, kW, MW, hp, BTU/h), and Force (N, kN, lbf, kgf, dyn). Total 11 conversion categories.
- **Testing & Verification**:
  - Added 41 new unit and integration tests (totaling 144 tests across 8 suites, 100% passing).
  - Added 3 new Playwright E2E tests (totaling 10 tests across desktop and mobile, 100% passing).
  - Maintained zero Oxlint warnings across 59 files.
  - Detailed engineering documentation in `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/MATH_ACCURACY.md`, and `docs/TESTING.md`.

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
