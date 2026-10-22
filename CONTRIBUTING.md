# Contributing to Arc Calculator

Thank you for your interest in contributing to Arc Calculator! We welcome high-quality pull requests and issues.

## Development Workflow

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ranaaryan-work/arc-calculator.git
   cd arc-calculator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Run unit & integration test suites**:
   ```bash
   npm test
   ```

5. **Run TypeScript check & production build**:
   ```bash
   npm run build
   ```

6. **Run linter**:
   ```bash
   npm run lint
   ```

## Architectural Guidelines

- **Mathematical Engine Separation**: All mathematical logic (tokenization, parsing, evaluation, formatting) must remain decoupled from React presentation components inside `src/calculator/`.
- **Zero `eval()`**: Never introduce `eval()`, `new Function()`, or dynamic code evaluation.
- **Strict Typing**: Keep TypeScript in strict mode without `any` shortcuts.
- **Accessibility**: Verify keyboard operability, contrast ratios, and ARIA labels.
- **Anti-Slop Aesthetics**: Maintain the restrained, desktop utility design system defined in `src/styles/tokens.css`.
