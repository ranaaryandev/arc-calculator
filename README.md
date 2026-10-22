# Arc Calculator

> A refined, mathematically rigorous scientific calculator web application built with precision, interactive expression editing, and zero `eval()` dependencies.

Arc Calculator is an open-source, local-first scientific calculator inspired by the restraint, precision, and usability of classic desktop utilities and professional developer tools. It provides a reliable computing engine for students, developers, and engineers while maintaining a clean, accessible interface.

---

## Screenshots

| Desktop View | Mobile View (375px) |
| :---: | :---: |
| ![Desktop Interface](docs/screenshots/desktop.png) | ![Mobile Interface](docs/screenshots/mobile.png) |

---

## Key Features

- **Mathematically Sound & Safe AST Engine**: Expressions are tokenized and parsed into an Abstract Syntax Tree (AST) using a custom recursive descent parser with precedence climbing. User inputs are never passed to `eval()` or `new Function()`.
- **Interactive Expression Editor**: Click anywhere in the expression, select text, or use arrow keys to navigate the cursor and modify formulas directly.
- **Unmistakable 4-Column Keypad**: The primary keypad is laid out in a clean 4-column grid (`7 8 9 ÷`, `4 5 6 ×`, `1 2 3 −`, `± 0 . +`, with `=` prominent), with `AC`, `C`, and `Backspace` grouped above.
- **Collapsible Scientific Suite**: Toggle between a pure standard calculator and an expanded scientific panel on demand (automatically collapsed on narrow screens for single-handed mobile use).
  - Powers ($x^y, x^2, x^3$), square roots ($\sqrt{x}$), cube roots ($\sqrt[3]{x}$), and arbitrary roots ($\sqrt[y]{x}$).
  - Trigonometric ($\sin, \cos, \tan$) and inverse trigonometric ($\sin^{-1}, \cos^{-1}, \tan^{-1}$) functions with DEG/RAD support.
  - Hyperbolic functions ($\sinh, \cosh, \tanh$).
  - Factorials ($n!$) for non-negative integers up to $170!$.
  - Natural logarithm ($\ln$), common logarithm ($\log_{10}$), base-2 logarithm ($\log_2$), and exponential ($e^x$).
  - Constants $\pi$ and $e$ with high precision.
- **Precision & Rounding Options**: Select between Auto (12 significant figures with IEEE-754 cleanup), fixed decimal places (2, 4, 6, 8 decimals), or raw unrounded floating-point values.
- **Scientific Constants Catalog**: Instant reference and 1-click insertion for math, physics, and chemistry constants (Speed of Light, Planck's constant, Gravitational constant, Avogadro, Gas constant, etc.) with CODATA sources and SI units.
- **Expanded Unit Converter Catalog**: Full conversion across 7 domains:
  - **Angle**: Degrees, Radians, Gradians, Arcminutes, Arcseconds.
  - **Temperature**: Celsius, Fahrenheit, Kelvin, Rankine.
  - **Length**: Meters, Kilometers, Centimeters, Millimeters, Feet, Inches, Yards, Miles, Nautical Miles.
  - **Area**: Square Meters, Square Feet, Hectares, Acres, Square Kilometers, Square Miles.
  - **Volume**: Liters, Milliliters, Gallons (US), Quarts, Pints, Cups, Cubic Meters, Cubic Feet.
  - **Mass**: Kilograms, Grams, Milligrams, Pounds, Ounces, Metric Tons.
  - **Speed**: m/s, km/h, mph, knots, ft/s.
- **Physical Keyboard First**: Complete keyboard mapping for all numeric entries, operators, brackets, and scientific functions with on-screen shortcuts help (`?`).
- **Persistent Calculation History**: Automatically logs calculations to local storage with search, timestamp, and single-click reuse of previous expressions or results.
- **Standard Memory Functions**: Full support for Memory Clear (`MC`), Memory Recall (`MR`), Memory Add (`M+`), Memory Subtract (`M-`), and Memory Store (`MS`) with active display pill indicators.
- **100% Local-First & Zero Telemetry**: Operates entirely in the client browser with no external network requests, cookies, or analytics trackers.
- **Light & Dark Themes**: Thoughtfully balanced color palettes with tabular numerals (`tabular-nums`) and support for system color preferences.

---

## Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS Modules with strict CSS Design Tokens (`tokens.css`)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) (61 tests)
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
git clone https://github.com/ranaaryandev/arc-calculator.git
cd arc-calculator

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Open `http://localhost:5174` in your browser.

---

## Testing & Quality Assurance

Arc Calculator includes a comprehensive 61-test suite covering arithmetic precedence, trigonometry, logarithms, domain errors, React hooks, and accessibility.

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

## Roadmap

- [x] Custom AST Tokenizer & Recursive Descent Parser (Zero `eval()`).
- [x] Standard 4-column keypad hierarchy with prominent equals key.
- [x] Collapsible scientific panel with DEG/RAD angular modes.
- [x] Interactive cursor-aware expression editor.
- [x] Configurable decimal precision (Auto, 2..8 decimals, Raw unrounded).
- [x] Scientific constants catalog (Math, Physics, Chemistry with CODATA citations).
- [x] Expanded unit converter catalog (Angle, Temp, Length, Area, Volume, Mass, Speed).
- [x] Persistent calculation history with search and click-to-reuse.
- [x] Memory operations (MC, MR, M+, M-, MS) with active display indicators.
- [x] Full physical keyboard shortcut bindings.
- [x] Automated CI pipeline (lint, typecheck, vitest).
- [ ] Programmer mode (Hex, Decimal, Octal, Binary bitwise operations).
- [ ] Responsive function plotting / 2D canvas graphing.

---

## Privacy & Local Storage

Arc Calculator operates under a zero-telemetry policy:
- No user calculations or inputs are transmitted to any server.
- The following keys are stored strictly in the user's browser `localStorage`:
  - `arc-calc-theme`: Theme selection (`dark` or `light`).
  - `arc-calc-angle-mode`: Angle mode (`DEG` or `RAD`).
  - `arc-calc-show-scientific`: Scientific section visibility state.
  - `arc-calc-decimals`: Configured decimal rounding precision.
  - `arc-calc-unrounded`: Raw unrounded result toggle.
  - `arc-calc-memory`: Value stored in memory.
  - `arc-calc-history`: List of past calculations (capped at 50 items).
- All stored state can be cleared at any time via the "Clear Local Storage Data" option in the **About** dialog.

---

## Project Structure

```
arc-calculator/
├── .github/
│   ├── ISSUE_TEMPLATE/            # GitHub issue templates
│   └── workflows/
│       ├── ci.yml                 # Automated CI (lint, test, build)
│       └── deploy.yml             # GitHub Actions deployment to Pages
├── docs/
│   └── screenshots/               # Application screenshots
├── public/
│   ├── favicon.svg                # Minimalist SVG favicon
│   └── manifest.json              # Web App Manifest
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
│   │   ├── Display/               # Expression editor, preview, result, & precision
│   │   ├── Footer/                # Privacy notice & version
│   │   ├── Header/                # Brand, angle switch, & tool triggers
│   │   ├── History/               # Calculation history drawer
│   │   ├── Keypad/                # Standard, scientific, & memory keys
│   │   └── Modals/                # Shortcuts, About, Constants, & Converter
│   ├── config/
│   │   └── appConfig.ts           # Centralized configuration & naming
│   ├── hooks/                     # Custom React state & interaction hooks
│   │   ├── useCalculator.ts       # Calculator state machine, cursor & memory
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
4. The included workflow (`.github/workflows/deploy.yml`) will automatically build, test, and deploy the application on push to `main`.

---

## License

This project is licensed under the [MIT License](LICENSE).
