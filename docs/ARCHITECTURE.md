# Arc Calculator 2.0 — System Architecture

## 1. High-Level Architecture Overview

Arc Calculator 2.0 is structured as a modular, client-side single-page application built on React 19, TypeScript 5.8, and Vite, styled using CSS Modules and CSS Design Tokens.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       Presentation Layer (UI/UX)                       │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────────────────────┐  │
│  │ Calculator    │  │ Mode Switcher  │  │ Engineering Toolkit       │  │
│  │ Display       │  │ (11 Modes)     │  │ (EE, ME, CE, CS, Math)    │  │
│  └───────┬───────┘  └───────┬────────┘  └─────────────┬─────────────┘  │
│          │                  │                         │                │
├──────────┴──────────────────┴─────────────────────────┴────────────────┤
│                    Application State & Hooks Layer                     │
│  ┌───────────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ useCalculator         │  │ useKeyboard      │  │ useLocalStorage │  │
│  │ (Undo/Redo, History)  │  │ (Shortcuts)      │  │ (Fail-safe)     │  │
│  └───────────┬───────────┘  └──────────────────┘  └─────────────────┘  │
├──────────────┴─────────────────────────────────────────────────────────┤
│                   Mathematical & Computation Engines                   │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ Safe AST Parser & Evaluator     │  │ Dedicated Solvers & Tools   │  │
│  │ • Tokenizer (Lookahead)         │  │ • Equation Solver           │  │
│  │ • Recursive Descent Parser      │  │ • Matrix & Vector Engine    │  │
│  │ • AST Evaluator (Zero eval())   │  │ • Complex Number Engine     │  │
│  │ • Number Formatter              │  │ • Statistics & Distribution │  │
│  │ • Resource Limits Sentinel      │  │ • Base-N Integer Engine     │  │
│  └─────────────────────────────────┘  └─────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Mathematical Engine Architecture (`src/calculator/`)

1. **Lexical Analysis (`tokenizer.ts`)**:
   - Converts input strings into structured tokens with character positions.
   - Disambiguates contextual operators: lookahead determines whether `%` is a binary modulo operator (`10 % 3 = 1`) or a postfix percentage (`50% = 0.5`).
   - Normalizes constants ($\pi, e$) and functions ($\sin, \cos, \ln, \text{sqrt}$, etc.).
2. **Recursive Descent Parsing (`parser.ts`)**:
   - Operator precedence climbing ensures strict conventional mathematical associativity.
   - Exponentiation (`^`, prec 40) is right-associative and binds tighter than unary minus (`-`, prec 30) so `-2^2 = -4` and `(-2)^2 = 4`.
   - Iterative unary parsing with `MAX_UNARY_CHAIN = 20` prevents engine call stack overflow.
   - Nesting depth enforced with `MAX_PARSE_DEPTH = 40`.
3. **AST Evaluation (`evaluator.ts`)**:
   - Evaluates nodes deterministically with strict numeric validation (`Number.isFinite`).
   - Real-domain validation: negative radicands strictly require odd-integer indices (`root(3, -8) = -2`; `root(2, -8)` throws `DOMAIN_ERROR`).
   - Factorial ceiling bounded at $170!$; inputs $> 170$ throw `OVERFLOW`.
   - Division by zero and trigonometric singularities ($\tan(90^\circ)$) produce explicit domain errors.
4. **Number Formatting (`formatter.ts`)**:
   - Precision settings: Auto (12 significant figures with IEEE-754 epsilon cleanup), fixed decimals (2, 4, 6, 8), and raw unrounded floating-point.
   - Cleans negative zero (`-0` normalized to `'0'`).

---

## 3. Dedicated Solvers & Engineering Toolkit Architecture (`src/solvers/` & `src/tools/`)

1. **Equation Solver Engine (`src/solvers/equations.ts`)**:
   - Linear equations: $ax + b = 0 \implies x = -b/a$. Handles $a=0, b=0$ (infinite solutions) and $a=0, b \ne 0$ (no solution).
   - Quadratic equations: $ax^2 + bx + c = 0$ with discriminant $\Delta = b^2 - 4ac$. Computes both real and complex conjugate roots ($x = \frac{-b \pm i\sqrt{-\Delta}}{2a}$).
   - 2x2 and 3x3 Linear Systems: Determinant-based Cramer's rule with condition checks for singular and dependent systems.
2. **Matrix Algebra Engine (`src/solvers/matrices.ts`)**:
   - Supports 2x2, 3x3, and 4x4 matrices.
   - Operations: Addition, Subtraction, Multiplication, Scalar Multiplication, Transpose, Determinant, Adjugate, Matrix Inversion ($A^{-1} = \frac{1}{\det(A)}\text{adj}(A)$), and Solving $Ax = b$.
3. **Vector Engine (`src/solvers/vectors.ts`)**:
   - 2D & 3D vector arithmetic, Euclidean magnitude, dot product ($\mathbf{u} \cdot \mathbf{v}$), cross product ($\mathbf{u} \times \mathbf{v}$ for 3D), unit vectors, and angle between vectors.
4. **Complex Number Engine (`src/solvers/complex.ts`)**:
   - Cartesian ($a + bi$) and Polar ($r \angle \theta^\circ$) representations.
   - Arithmetic: $(a+bi) \pm (c+di)$, $(a+bi)(c+di)$, $(a+bi)/(c+di)$, modulus $\sqrt{a^2+b^2}$, argument $\text{atan2}(b,a)$, and complex conjugate.
5. **Statistics & Distributions Engine (`src/solvers/statistics.ts`)**:
   - Descriptive statistics: Mean, Median, Mode, Variance, Sample Standard Deviation ($n-1$ denominator), Population Standard Deviation ($n$ denominator), Quartiles ($Q_1, Q_3$), and Interquartile Range ($IQR$).
   - Linear Regression: Computes slope $m$, intercept $c$, Pearson correlation coefficient $r$, and coefficient of determination $R^2$.
   - Probability & Distributions: Permutations $nPr$, Combinations $nCr$, Binomial distribution probability mass function $P(X=k) = \binom{n}{k}p^k(1-p)^{n-k}$, Normal distribution PDF and CDF using polynomial approximation of error function $\text{erf}(x)$.
6. **Base-N Number Systems (`src/solvers/baseN.ts`)**:
   - Conversions between Decimal, Binary, Octal, and Hexadecimal.
   - Bitwise operations: AND, OR, XOR, NOT, Shift Left, Shift Right with selectable word sizes (8-bit, 16-bit, 32-bit).
7. **Engineering Toolkit Engine (`src/tools/registry.ts`)**:
   - Discipline-based modular registry covering Electrical, Mechanical, Civil, Computer, and Mathematics.
   - Standardized tool interface: inputs, validation, calculation function, formula string, variable definitions, worked steps, and copyable results.

---

## 4. UI/UX Component Hierarchy

```
<App>
  ├── <Header> (Brand, Mode Switcher [MODE], Angle DEG/RAD, Converter, Constants, Graph, History, Theme)
  ├── Main Active View:
  │     ├── <CalculateView> (Display, 4-Column Keypad, Scientific Suite, Memory Bar)
  │     ├── <EquationSolverView>
  │     ├── <MatrixCalculatorView>
  │     ├── <VectorCalculatorView>
  │     ├── <ComplexCalculatorView>
  │     ├── <StatisticsView>
  │     ├── <ProbabilityView>
  │     ├── <BaseNCalculatorView>
  │     ├── <TableGeneratorView>
  │     ├── <UnitConverterModal/View>
  │     └── <EngineeringToolkitView> (Discipline filters, Search, Worked steps)
  ├── <HistoryPanel> (Slide-in drawer with persistence and search)
  ├── Modals:
  │     ├── <ModeSelectorModal>
  │     ├── <GraphModal> (Multi-function 2D Grapher)
  │     ├── <ConstantsModal>
  │     ├── <ShortcutsModal>
  │     └── <AboutModal>
  └── <Footer>
```
