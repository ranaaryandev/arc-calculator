import { describe, it, expect } from 'vitest'
import { ENGINEERING_TOOLS } from '../tools'

describe('Engineering Toolkit Calculators', () => {
  it('contains registered calculators for all primary engineering disciplines', () => {
    const categories = new Set(ENGINEERING_TOOLS.map((t) => t.category))
    expect(categories.has('electrical')).toBe(true)
    expect(categories.has('mechanical')).toBe(true)
    expect(categories.has('civil')).toBe(true)
    expect(categories.has('computer')).toBe(true)
  })

  it("calculates Ohm's law and electrical power correctly", () => {
    const ohmsTool = ENGINEERING_TOOLS.find((t) => t.id === 'ohms-law')!
    expect(ohmsTool).toBeDefined()
    // V = 24V, R = 12 ohm => I = 2A, P = 48W
    const out = ohmsTool.calculate({ v: 24, r: 12 })
    expect(out.numericValue).toBe(2)
    expect(out.value).toContain('2.0000 A')
    expect(out.value).toContain('48.0000 W')
    expect(out.steps.length).toBeGreaterThan(0)
  })

  it('calculates voltage divider output voltage correctly', () => {
    const vdiv = ENGINEERING_TOOLS.find((t) => t.id === 'voltage-divider')!
    // Vin = 10V, R1 = 1k, R2 = 1k => Vout = 5V
    const out = vdiv.calculate({ vin: 10, r1: 1000, r2: 1000 })
    expect(out.numericValue).toBe(5)
    expect(out.value).toBe('5.0000 V')
  })

  it('calculates series and parallel resistance accurately', () => {
    const tool = ENGINEERING_TOOLS.find((t) => t.id === 'series-parallel-resistors')!
    // R1 = 100, R2 = 100 => series = 200, parallel = 50
    const out = tool.calculate({ r1: 100, r2: 100 })
    expect(out.value).toContain('Series: 200.00 Ω')
    expect(out.value).toContain('Parallel: 50.00 Ω')
  })

  it('calculates RC time constant and cutoff frequency accurately', () => {
    const rc = ENGINEERING_TOOLS.find((t) => t.id === 'rc-filter')!
    // R = 1k (1000), C = 1 uF (1) => tau = 1 ms, fc = 1/(2*pi*0.001) ~ 159.15 Hz
    const out = rc.calculate({ r: 1000, c: 1 })
    expect(out.numericValue).toBeCloseTo(159.15, 1)
  })

  it("calculates Newton's second law force accurately", () => {
    const newton = ENGINEERING_TOOLS.find((t) => t.id === 'newtons-second-law')!
    // m = 5 kg, a = 2 m/s^2 => F = 10 N
    const out = newton.calculate({ m: 5, a: 2 })
    expect(out.numericValue).toBe(10)
    expect(out.value).toContain('10.000 N')
  })

  it('calculates mechanical stress and strain accurately', () => {
    const stressTool = ENGINEERING_TOOLS.find((t) => t.id === 'stress-strain')!
    // F = 20000 N, Area = 100 mm^2 => Stress = 200 MPa
    const out = stressTool.calculate({ f: 20000, area: 100, l0: 1000, dl: 1 })
    expect(out.numericValue).toBeCloseTo(200)
    expect(out.value).toContain('200.00 MPa')
  })

  it('calculates concrete slab volume and bag estimate accurately', () => {
    const concrete = ENGINEERING_TOOLS.find((t) => t.id === 'concrete-volume')!
    // 10m x 5m x 0.1m = 5 m3. With 0% waste = 5 m3.
    const out = concrete.calculate({ l: 10, w: 5, t: 0.1, waste: 0 })
    expect(out.numericValue).toBeCloseTo(5)
  })

  it("calculates two's complement binary representation accurately", () => {
    const twos = ENGINEERING_TOOLS.find((t) => t.id === 'twos-complement')!
    // -1 in 8-bit two's complement is 11111111 (0xFF)
    const out = twos.calculate({ val: -1, bits: 8 })
    expect(out.value).toContain('11111111')
    expect(out.value).toContain('0xFF')
  })
})
