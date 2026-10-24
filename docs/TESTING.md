# Arc Calculator 2.0 — Testing & Verification Strategy

## 1. Test Architecture
The test suite utilizes **Vitest** for fast, isolated unit and integration testing, **React Testing Library** for component verification, and **Playwright** for headless Chromium browser automation.

```
src/test/
├── evaluator.test.ts                    # Core AST calculation & functions
├── formatter.test.ts                    # Display & decimal precision formatting
├── regression-and-adversarial.test.ts  # Precedence, boundary limits, fuzzing
├── storage.test.ts                      # LocalStorage failure recovery
├── calculator-hook.test.ts              # useCalculator state & undo/redo
├── ui.test.tsx                          # React component & modal interactions
├── solvers.test.ts                      # Equations, Matrices, Vectors, Complex, Stats
└── engineering-tools.test.ts            # Electrical, Mechanical, Civil, CS calculators

scripts/
└── e2e-browser-test.mjs                 # Playwright full-flow browser test
```

---

## 2. Test Coverage Matrix

| Component / Subsystem | Verification Technique | Target |
|---|---|---|
| Core AST Math Engine | Unit tests against analytical truths | 100% core rules |
| Precedence & Associativity | Regression test table (`-2^2`, `2^3^2`, `10%3`) | Strict compliance |
| Adversarial Inputs & Fuzzing | 50 random expressions + extreme inputs | No uncaught crashes |
| Storage Resilience | Mocked storage throwing `QuotaExceededError` | Graceful fallback |
| Equation Solvers | Real and complex quadratic roots, 2x2 & 3x3 systems | Exact solutions |
| Matrix & Vector Algebra | Inversion, determinants, 3D cross products | Analytical identities |
| Engineering Tools | Standard textbook engineering examples | SI unit consistency |
| Browser UI & Mobile Viewports | Playwright E2E in headless Chromium | 0 overflow at 375px |
