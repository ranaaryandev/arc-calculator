# Arc Calculator

> A refined, mathematically rigorous scientific calculator web application built with precision, keyboard navigation, and zero `eval()` dependencies.

Arc Calculator is an open-source, local-first scientific calculator inspired by the restraint, precision, and usability of classic desktop utilities and professional developer tools. It provides a reliable computing engine for students, developers, and engineers while maintaining a clean, accessible interface.

---

## Screenshots

| Desktop View | Mobile View (375px) |
| :---: | :---: |
| ![Desktop Interface](docs/screenshots/desktop.png) | ![Mobile Interface](docs/screenshots/mobile.png) |

---

## Key Features

- **Mathematically Sound & Safe AST Engine**: Expressions are tokenized and parsed into an Abstract Syntax Tree (AST) using a custom recursive descent parser with precedence climbing. User inputs are never passed to `eval()` or `new Function()`.
- **Comprehensive Scientific Suite**:
  - Powers ($x^y, x^2, x^3$), square roots ($\sqrt{x}$), cube roots ($\sqrt[3]{x}$), and arbitrary roots ($\sqrt[y]{x}$).
  - Trigonometric ($\sin, \cos, \tan$) and inverse trigonometric ($\sin^{-1}, \cos^{-1}, \tan^{-1}$) functions with DEG/RAD support.
  - Hyperbolic functions ($\sinh, \cosh, \tanh$).
  - Factorials ($n!$) for non-negative integers up to $170!$.
  - Natural logarithm ($\ln$), common logarithm ($\log_{10}$), base-2 logarithm ($\log_2$), and exponential ($e^x$).
  - Constants $\pi$ and $e$ with high precision.
- **Precision & Singularity Protection**:
  - Automatically mitigates binary IEEE-754 floating-point artifacts (e.g. $0.1 + 0.2 = 0.3$).
  - Flags mathematical singularities explicitly (e.g. $\tan(90^\circ)$ produces an "Undefined (tangent singularity)" error rather than misleading large numbers).
  - Enforces real-number domain rules: $\sqrt{-1}$, $\ln(0)$, and division by zero are cleanly caught.
- **Physical Keyboard First**: Complete keyboard mapping for all numeric entries, operators, brackets, and scientific functions with on-screen shortcuts help (`?`).
- **Persistent Calculation History**: Automatically logs calculations to local storage with search, timestamp, and single-click reuse of previous expressions or results.
- **Standard Memory Functions**: Full support for Memory Clear (`MC`), Memory Recall (`MR`), Memory Add (`M+`), Memory Subtract (`M-`), and Memory Store (`MS`).
- **Educational Unit Converter**: Quick conversions for angles (degrees $\leftrightarrow$ radians), temperatures ($^\circ\text{C} \leftrightarrow ^\circ\text{F} \leftrightarrow \text{K}$), lengths, and masses with direct insertion into the calculator.
- **100% Local-First & Zero Telemetry**: Operates entirely in the client browser with no external network requests, cookies, or analytics trackers.
- **Light & Dark Themes**: Thoughtfully balanced color palettes with tabular numerals (`tabular-nums`) and support for system color preferences.

---

## Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS Modules with strict CSS Design Tokens (`tokens.css`)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linter**: [Oxlint](https://oxc.rs/)
- **Deployment**: GitHub Pages via GitHub Actions

---

## Getting Started

### Prerequisites

- Node.js `v20.0.0` or higher
- npm `v10.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/ranaaryan-work/arc-calculator.git
cd arc-calculator

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Testing & Quality Assurance

Arc Calculator includes a 57-test suite covering arithmetic precedence, trigonometry, logarithms, domain errors, React hooks, and accessibility.

```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Build for production with strict TypeScript checks
npm run build
```

---

## Supported Operations & Syntax

| Operation | Syntax Example | Notes |
| :--- | :--- | :--- |
| Addition / Subtraction | `2 + 3`, `12 - 5` | Also supports unicode minus (`−`) |
| Multiplication / Division | `6 * 7`, `15 / 3` | Supports `×`, `÷`, and implicit multiplication `2(3)` |
| Exponentiation | `2^10`, `2^3^2` | Right-associative: $2^{(3^2)} = 512$ |
| Percentage | `100 + 10%`, `50 * 20%` | $100 + 10\% = 110$; standalone `50%` $= 0.5$ |
| Square Root / Cube Root | `sqrt(81)`, `cbrt(27)` | Real domain: negative roots rejected |
| Arbitrary Root | `root(3, 27)` | Evaluates $\sqrt[n]{x}$ |
| Factorial | `5!`, `0!` | Non-negative integers $\le 170$ |
| Natural & Base-10 Log | `ln(e)`, `log10(1000)` | Domain: $x > 0$ |
| Trigonometry | `sin(30)`, `cos(60)`, `tan(45)` | Evaluated according to active DEG/RAD mode |
| Inverse Trigonometry | `asin(0.5)`, `acos(0.5)` | Domain: $-1 \le x \le 1$ |
| Hyperbolic | `sinh(1)`, `cosh(1)`, `tanh(1)` | Standard hyperbolic trigonometry |

---

## Angle Mode Behavior (DEG / RAD)

- **Degrees (`DEG`)**: Standard angular measurements ($0^\circ - 360^\circ$). Standard angles ($\sin(30^\circ) = 0.5$, $\cos(60^\circ) = 0.5$, $\cos(90^\circ) = 0$) are normalized to avoid floating-point drift. Singularities such as $\tan(90^\circ)$ and $\tan(270^\circ)$ immediately raise domain errors.
- **Radians (`RAD`)**: Natural angular measurements in radians. Used for calculus and analytical math ($\sin(\pi/6) = 0.5$).
- Switching modes updates pending trigonometric calculations immediately without corrupting entered numeric literals.

---

## Numerical Precision & Policy

Arc Calculator relies on JavaScript's standard 64-bit IEEE-754 double-precision floating-point numbers.
- **Significant Figures**: The display formats results up to 12 significant figures, automatically trimming trailing zeros.
- **Scientific Notation**: Values with $|x| \ge 10^{14}$ or $0 < |x| < 10^{-7}$ are rendered in scientific exponential notation ($1.5\text{e}+15$).
- **Precision Cleanup**: Guard tolerances eliminate binary artifacts like $0.1 + 0.2 = 0.30000000000000004$, formatting cleanly as `0.3`.
- **Arbitrary Precision**: This application does not implement arbitrary-precision BigNum arithmetic; calculations are bound by IEEE-754 limits (values $> 1.7976931348623157 \times 10^{308}$ resolve to `Infinity`).

---

## Privacy & Local Storage

Arc Calculator operates under a zero-telemetry policy:
- No user calculations or inputs are transmitted to any server.
- The following keys are stored strictly in the user's browser `localStorage`:
  - `arc-calc-theme`: Theme selection (`dark` or `light`).
  - `arc-calc-angle-mode`: Angle mode (`DEG` or `RAD`).
  - `arc-calc-memory`: Value stored in memory.
  - `arc-calc-history`: List of past calculations (capped at 50 items).
- All stored state can be cleared at any time via the "Clear All Local Storage Data" option in the **About** dialog.

---

## Project Structure

```
arc-calculator/
├── .github/
│   └── workflows/deploy.yml       # GitHub Actions deployment to Pages
├── docs/
│   └── screenshots/               # Application screenshots
├── public/
│   └── favicon.svg                # Original minimalist SVG favicon
├── src/
│   ├── calculator/                # Decoupled mathematical calculation engine
│   │   ├── constants.ts           # Math constants & operator precedence
│   │   ├── evaluator.ts           # AST evaluator & domain safeguards
│   │   ├── formatter.ts           # Precision & display formatting
│   │   ├── index.ts               # Public calculation engine API
│   │   ├── parser.ts              # Recursive descent parser
│   │   ├── tokenizer.ts           # Tokenizer with implicit multiplication
│   │   └── types.ts               # Core mathematical & AST types
│   ├── components/                # React presentation components
│   │   ├── Display/               # Expression, preview, result, & copy
│   │   ├── Footer/                # Privacy notice & shortcuts trigger
│   │   ├── Header/                # Brand, angle switch, & tool triggers
│   │   ├── History/               # Calculation history drawer
│   │   ├── Keypad/                # Standard, scientific, & memory keys
│   │   └── Modals/                # Shortcuts, About, & Unit Converter
│   ├── config/
│   │   └── appConfig.ts           # Centralized configuration & naming
│   ├── hooks/                     # Custom React state & interaction hooks
│   │   ├── useCalculator.ts       # Calculator state machine & memory
│   │   ├── useKeyboard.ts         # Physical keyboard listener
│   │   ├── useLocalStorage.ts     # Resilient browser storage hook
│   │   └── useTheme.ts            # Dark/light theme manager
│   ├── styles/
│   │   ├── global.css             # Resets, animations, & accessibility
│   │   └── tokens.css             # Design tokens (colors, radii, spacing)
│   ├── test/                      # Vitest & RTL test suites
│   │   ├── calculator-hook.test.ts# Hook integration tests
│   │   ├── evaluator.test.ts      # Mathematical engine tests
│   │   ├── formatter.test.ts      # Number formatting tests
│   │   ├── setup.ts               # Test environment setup
│   │   └── ui.test.tsx            # Component & accessibility tests
│   ├── App.tsx                    # Root application component
│   └── main.tsx                   # DOM entry point
├── index.html                     # HTML shell with Open Graph metadata
├── package.json                   # Project metadata & dependencies
├── tsconfig.json                  # Strict TypeScript configuration
└── vite.config.ts                 # Vite bundler & test configuration
```

---

## Deployment

The application is configured for deployment as a static website on **GitHub Pages** or **Cloudflare Pages**.

### Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In the GitHub repository settings, navigate to **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment**, set the **Source** to **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) will automatically build, test, and deploy the application on push to `main` or `master`.

---

## Contributing

Please review [CONTRIBUTING.md](CONTRIBUTING.md) for details on code style, testing requirements, and submission processes.

---

## License

This project is licensed under the [MIT License](LICENSE).
