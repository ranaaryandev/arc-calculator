# Arc Calculator 2.0 — Implementation Plan & Phase Zero Audit

## Phase Zero Audit Findings

1. **What already works**:
   - Safe AST mathematical parser, tokenizer, and evaluator with 103 passing Vitest tests.
   - Operator precedence, right-associative powers (`2^3^2 = 512`), unary minus binding (`-2^2 = -4`), and odd-integer negative roots (`root(3, -8) = -2`).
   - Disambiguated modulo (`10 % 3 = 1`) and percentage (`50% = 0.5`, `100 + 10% = 110`).
   - Interactive expression editing with cursor positioning, Undo/Redo stack (`Ctrl+Z`, `Ctrl+Y`).
   - Keypad with standard 4-column arithmetic and collapsible scientific panel.
   - Multi-function 2D function grapher ($f_1(x)$ and $f_2(x)$) with zoom, pan, origin reset, and coordinate tracing.
   - Scientific constants and unit converter dialogs.
   - Playwright end-to-end browser suite (7 tests) verifying clicks, calculations, modals, and viewport responsiveness.
   - Strict TypeScript compilation (`tsc -b`) and Oxlint static analysis with 0 errors.

2. **What is broken or missing**:
   - Absence of physical-calculator-style dedicated modes (Equations, Matrices, Vectors, Complex Numbers, Statistics, Probability, Base-N, Table of Values).
   - Absence of dedicated university engineering toolkits (Electrical, Mechanical, Civil, Computer Engineering calculators with formulas, worked steps, and SI units).
   - Mode switching UX: currently only standard calculation mode is accessible directly on the main screen.

3. **What can be reused**:
   - The entire AST tokenizer, parser, and evaluator (`src/calculator/`).
   - The reactive calculator hook `useCalculator` and expression state management.
   - The storage layer with `QuotaExceededError` resilience (`useLocalStorage`).
   - The design tokens (`tokens.css`), theming system, and header/footer infrastructure.

4. **Which dependencies are installed**:
   - Runtime: `react` (^19.3.1), `react-dom` (^19.3.1), `lucide-react` (^1.61.0).
   - Dev: `typescript` (~6.0.3), `vite` (^8.3.4), `vitest` (^5.0.5), `oxlint` (^1.88.0), `playwright` (^1.64.1), `@testing-library/react` (^16.3.3).
   - All proposed additions are pure TypeScript/React: 0 additional runtime dependencies needed!

5. **Changes that carry regression risk**:
   - Integrating the mode navigation system must not break existing keyboard shortcuts or main calculation flow.
   - Preserving the existing test suite (103 Vitest tests + 7 Playwright tests).

6. **Highest-priority improvements**:
   - Build pure mathematical solver engines for Equations, Matrices, Vectors, Complex, Statistics, Probability, Base-N, and Table generator.
   - Build the Engineering Toolkit engine with discipline calculators (Electrical, Mechanical, Civil, Computer).
   - Build the `[MODE]` selector dialog and modular views.
   - Comprehensive test suites for all new mathematical engines and engineering tools.

7. **Implementation Order**:
   - **Step 1**: Implement pure mathematical solvers (`src/solvers/`: equations, matrices, vectors, complex, statistics, probability, baseN).
   - **Step 2**: Implement engineering toolkit registry & calculators (`src/tools/`).
   - **Step 3**: Create dedicated view components for each mode and the physical-style Mode Selector.
   - **Step 4**: Integrate mode switcher into `Header.tsx` and `App.tsx`.
   - **Step 5**: Write comprehensive Vitest unit tests for all solvers and engineering tools.
   - **Step 6**: Update Playwright E2E browser tests and capture fresh screenshots.
   - **Step 7**: Verify build, lint, and deployment.
