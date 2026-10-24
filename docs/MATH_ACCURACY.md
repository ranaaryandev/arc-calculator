# Arc Calculator 2.0 — Mathematical Specifications & Accuracy Standards

## 1. Core Arithmetic & Precedence Rules
- **Precedence Hierarchy**:
  1. Parentheses and function arguments: `(...)` (Level 50)
  2. Postfix Factorial (`!`) and Postfix Percentage (`%`): (Level 45, Left-to-Right)
  3. Exponentiation (`^`): (Level 40, Right-to-Left, e.g. `2^3^2 = 2^(3^2) = 512`)
  4. Unary Plus and Unary Minus (`+`, `-`): (Level 30, Right-to-Left, e.g. `-2^2 = -(2^2) = -4`, `(-2)^2 = 4`)
  5. Multiplication, Division, Binary Modulo (`*`, `/`, `%`): (Level 20, Left-to-Right)
  6. Addition and Subtraction (`+`, `-`): (Level 10, Left-to-Right)

---

## 2. Real-Domain Boundary Conditions
- **Roots**:
  - For $n\text{th}$ root $\sqrt[n]{x}$:
    - If $n = 0$: `DOMAIN_ERROR` (undefined index).
    - If $x < 0$: $n$ must be an odd integer ($n \in \{ \pm 1, \pm 3, \pm 5, \dots \}$). Even indices and non-integer indices with negative radicands throw `DOMAIN_ERROR`.
    - Example: $\text{root}(3, -8) = -2$, $\text{root}(2, -8) \implies \text{DOMAIN\_ERROR}$.
- **Trigonometric Singularities**:
  - $\tan(x)$ where $x = (90 + 180k)^\circ$ in DEG mode or $(\pi/2 + k\pi)$ in RAD mode throws `DOMAIN_ERROR`.
- **Factorials**:
  - Restricted to non-negative integers $n \in \{0, 1, 2, \dots, 170\}$.
  - $n > 170$ throws `OVERFLOW` (exceeds IEEE-754 double precision limit $\approx 1.79 \times 10^{308}$).
  - Negative or fractional inputs throw `DOMAIN_ERROR`.

---

## 3. Dedicated Solvers Mathematical Algorithms

### A. Quadratic Equation Solver
For $ax^2 + bx + c = 0$ ($a \neq 0$):
- Discriminant: $\Delta = b^2 - 4ac$.
- Case $\Delta > 0$: Two distinct real roots: $x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}$.
- Case $\Delta = 0$: One repeated real root: $x = \frac{-b}{2a}$.
- Case $\Delta < 0$: Two complex conjugate roots: $x = \frac{-b}{2a} \pm i\frac{\sqrt{-\Delta}}{2a}$.

### B. Linear Systems (Cramer's Rule & Gaussian Elimination)
For $2 \times 2$ system:
$$\begin{cases} a_1 x + b_1 y = c_1 \\ a_2 x + b_2 y = c_2 \end{cases}$$
Determinant $D = a_1 b_2 - a_2 b_1$.
- If $|D| > 10^{-12}$: Unique solution $x = \frac{c_1 b_2 - c_2 b_1}{D}$, $y = \frac{a_1 c_2 - a_2 c_1}{D}$.
- If $|D| \le 10^{-12}$: Detects singular system (inconsistent = No Solution, or dependent = Infinite Solutions).

### C. Matrix Inversion & Determinant
- Matrix inverse computed via adjugate method for $2 \times 2$ and $3 \times 3$:
  $$A^{-1} = \frac{1}{\det(A)}\text{adj}(A)$$
- If $|\det(A)| < 10^{-14}$, the matrix is classified as singular and inversion is rejected with an explicit error.

### D. Vector Operations
- Dot product: $\mathbf{u} \cdot \mathbf{v} = \sum u_i v_i$.
- Cross product (3D): $\mathbf{u} \times \mathbf{v} = (u_y v_z - u_z v_y, u_z v_x - u_x v_z, u_x v_y - u_y v_x)$.
- Angle: $\theta = \arccos\left(\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}\right)$. If either vector is zero, angle is flagged as undefined.

### E. Normal Distribution CDF Approximation
The cumulative distribution function $\Phi(z)$ of the standard normal distribution is computed using the error function:
$$\Phi(z) = \frac{1}{2}\left[1 + \text{erf}\left(\frac{z}{\sqrt{2}}\right)\right]$$
The error function $\text{erf}(x)$ is evaluated via Chebyshev polynomial approximation with maximum relative error $< 1.5 \times 10^{-7}$.
