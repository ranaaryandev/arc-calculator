# Arc Calculator 2.0 — Product Requirements Document (PRD)

## 1. Executive Summary
**Arc Calculator 2.0** is an open-source, mathematically rigorous scientific calculator and university engineering toolkit. Designed for engineering students (Year 1 through Year 4), science undergraduates, and technical professionals, Arc 2.0 bridges the tactile familiarity of physical scientific calculators (inspired by the functional layout of instruments like the Casio fx-991CW) with the speed, responsiveness, and educational depth of modern web technology.

- **Product Name**: Arc Calculator
- **Release Version**: 2.0.0
- **Primary Audience**: University engineering and science students, educators, and technical professionals.
- **Budget & Hosting**: ₹0 budget, 100% free and open source, static client-side execution hosted on GitHub Pages.
- **Core Principle**: Zero `eval()`, zero telemetry, zero fake results, 100% offline-first.

---

## 2. Target Personas
1. **First-Year Engineering & Science Students**:
   - Needs: Calculus calculations, trigonometric functions in DEG/RAD, quadratic and linear equation solving, vector arithmetic, and physics unit conversions.
   - Pain Point: Confusing web calculators with invasive ads, obscure syntax, or hidden settings.
2. **Second & Third-Year Electrical & Electronics Students**:
   - Needs: AC impedance, RC time constants, resonant cutoff frequencies, Ohm's law, voltage/current dividers, and complex number arithmetic ($a + bi \leftrightarrow r\angle\theta$).
   - Pain Point: Need quick checks with clear formulas, worked steps, and proper SI units without opening heavy simulators.
3. **Mechanical & Civil Engineering Students**:
   - Needs: Beam shear and moment estimates, stress/strain calculations, torque, thermal expansion, hydrostatic fluid pressure, and concrete mix volume calculations.
   - Pain Point: Lack of fast, educational calculators that explicitly state formulas, assumptions, and units.
4. **Computer Engineering & Computer Science Students**:
   - Needs: Base conversions (DEC, BIN, OCT, HEX), bitwise operations, 8/16/32-bit two's complement interpretation, and data size conversions.

---

## 3. Product Vision & Architecture

### A. Scientific Calculator
- Physical-calculator-inspired display with dual-line natural input, live preview, angle mode indicators (DEG/RAD), memory indicators, and cursor navigation.
- 4-column standard keypad with collapsible scientific panel and memory controls.
- Safe AST mathematical engine handling operator precedence, right-associative powers (`2^3^2 = 512`), real-domain root checks, and strict boundaries.

### B. Dedicated Calculator Modes (Inspired by fx-991CW)
A central `[MODE]` selector providing 11 dedicated, working interfaces:
1. **Calculate**: Core scientific expression evaluation.
2. **Equations**: Linear ($ax+b=0$), Quadratic ($ax^2+bx+c=0$ with real/complex roots), 2x2 and 3x3 Linear Systems with Cramer's Rule, and Polynomial evaluation.
3. **Matrices**: Matrix arithmetic up to 4x4 (Addition, Subtraction, Multiplication, Scalar, Transpose, Determinant, Inverse, and Linear System Solving).
4. **Vectors**: 2D & 3D vector operations (Addition, Subtraction, Dot product, Cross product in 3D, Magnitude, Unit Vector, Angle between vectors).
5. **Complex Numbers**: Arithmetic in rectangular ($a + bi$) and polar ($r\angle\theta$) forms, conversion, modulus, argument, and complex conjugates.
6. **Statistics**: 1-Variable statistics (Mean, Median, Mode, Variance, Sample and Population Standard Deviations, Quartiles, IQR) and 2-Variable Linear Regression ($y = mx + c$, $r$, $r^2$).
7. **Probability & Distributions**: Permutations ($nPr$), Combinations ($nCr$), Binomial Distribution ($P(X=k)$), and Normal Distribution PDF & CDF.
8. **Number Systems (Base-N)**: Binary, Octal, Decimal, Hexadecimal conversions, integer arithmetic, and bitwise operations.
9. **Table of Values**: Evaluate $f(x)$ over $[x_{start}, x_{end}]$ with configurable step, with interactive tabular readout.
10. **Unit Converter**: 11 conversion domains (Angle, Temperature, Length, Area, Volume, Mass, Speed, Pressure, Energy, Power, Force).
11. **Engineering Toolkit**: Discipline-organized directory with educational worked formulas and SI units.

### C. Learning Companion
- Every engineering calculator displays the exact governing formula, substituted values, SI units, and engineering assumptions.
- Copyable results and 1-click insertion into the active calculation.

---

## 4. Non-Functional Requirements
- **Performance**: Zero external API calls for calculations; initial interactive load $< 500\text{ms}$; immediate client-side math execution.
- **Accessibility**: Full WCAG 2.1 AA compliance, visible focus indicators, semantic labels, screen-reader polite announcements, and reduced-motion support.
- **Responsive Layout**: Seamless operation from 320px mobile viewports up to 4K desktop screens without horizontal page overflow.
- **Privacy & Security**: Zero tracking cookies or telemetry; 100% local persistence via guarded `localStorage`. Zero `eval()` or dynamic script execution.
