/**
 * Arc Calculator 2.0 — Engineering Toolkit Registry
 * Real engineering calculations with formulas, variable definitions, worked steps, and SI units.
 */

import type { EngineeringTool } from './types'

export const ENGINEERING_TOOLS: EngineeringTool[] = [
  // ==========================================
  // ELECTRICAL & ELECTRONICS ENGINEERING
  // ==========================================
  {
    id: 'ohms-law',
    name: "Ohm's Law & DC Power",
    category: 'electrical',
    badge: 'EE',
    description: 'Calculates electrical potential, current, resistance, and dissipated power in a DC circuit.',
    formula: 'V = I · R  |  P = V · I = I² · R = V² / R',
    variables: [
      { id: 'v', label: 'Voltage', symbol: 'V', unit: 'V', description: 'Electric potential difference', defaultValue: 12 },
      { id: 'r', label: 'Resistance', symbol: 'R', unit: 'Ω', description: 'Electrical resistance', defaultValue: 100, min: 0.0001 },
    ],
    assumptions: ['Purely resistive DC circuit', 'Constant temperature and ohmic conductor'],
    calculate: (inputs) => {
      const v = inputs.v ?? 12
      const r = inputs.r ?? 100
      if (r <= 0) throw new Error('Resistance must be strictly positive.')
      const i = v / r
      const p = v * i
      return {
        resultLabel: 'Current & Power',
        value: `I = ${i.toFixed(4)} A, P = ${p.toFixed(4)} W`,
        numericValue: i,
        unit: 'A',
        formula: 'I = V / R,  P = V · I',
        steps: [
          `Given Voltage V = ${v} V, Resistance R = ${r} Ω`,
          `Current I = V / R = ${v} / ${r} = ${i.toFixed(6)} A (${(i * 1000).toFixed(2)} mA)`,
          `Power P = V · I = ${v} · ${i.toFixed(6)} = ${p.toFixed(6)} W`,
        ],
        assumptions: ['Linear ohmic resistance', 'No inductive or capacitive reactance'],
      }
    },
  },

  {
    id: 'voltage-divider',
    name: 'Voltage Divider Rule',
    category: 'electrical',
    badge: 'EE',
    description: 'Calculates the output voltage across the lower resistor in an unloaded series divider.',
    formula: 'V_out = V_in · [R₂ / (R₁ + R₂)]',
    variables: [
      { id: 'vin', label: 'Input Voltage', symbol: 'V_in', unit: 'V', description: 'Supply voltage', defaultValue: 5 },
      { id: 'r1', label: 'Top Resistor', symbol: 'R₁', unit: 'Ω', description: 'Resistance of upper branch', defaultValue: 10000, min: 0.001 },
      { id: 'r2', label: 'Bottom Resistor', symbol: 'R₂', unit: 'Ω', description: 'Resistance of lower branch', defaultValue: 10000, min: 0.001 },
    ],
    assumptions: ['High-impedance load (zero load current from V_out)', 'Steady-state operation'],
    calculate: (inputs) => {
      const vin = inputs.vin ?? 5
      const r1 = inputs.r1 ?? 10000
      const r2 = inputs.r2 ?? 10000
      if (r1 + r2 <= 0) throw new Error('Total resistance must be strictly positive.')
      const vout = vin * (r2 / (r1 + r2))
      const ratio = r2 / (r1 + r2)
      return {
        resultLabel: 'Output Voltage',
        value: `${vout.toFixed(4)} V`,
        numericValue: vout,
        unit: 'V',
        formula: 'V_out = V_in · [R₂ / (R₁ + R₂)]',
        steps: [
          `Total resistance R_total = R₁ + R₂ = ${r1} + ${r2} = ${r1 + r2} Ω`,
          `Division ratio = R₂ / R_total = ${r2} / ${r1 + r2} = ${ratio.toFixed(4)}`,
          `V_out = ${vin} · ${ratio.toFixed(4)} = ${vout.toFixed(6)} V`,
        ],
      }
    },
  },

  {
    id: 'series-parallel-resistors',
    name: 'Series & Parallel Resistors',
    category: 'electrical',
    badge: 'EE',
    description: 'Calculates total equivalent resistance for two resistors in series and in parallel.',
    formula: 'R_series = R₁ + R₂  |  R_parallel = (R₁ · R₂) / (R₁ + R₂)',
    variables: [
      { id: 'r1', label: 'Resistor 1', symbol: 'R₁', unit: 'Ω', description: 'First resistance', defaultValue: 100, min: 0.001 },
      { id: 'r2', label: 'Resistor 2', symbol: 'R₂', unit: 'Ω', description: 'Second resistance', defaultValue: 100, min: 0.001 },
    ],
    assumptions: ['Independent passive linear resistors'],
    calculate: (inputs) => {
      const r1 = inputs.r1 ?? 100
      const r2 = inputs.r2 ?? 100
      const rSeries = r1 + r2
      const rParallel = (r1 * r2) / (r1 + r2)
      return {
        resultLabel: 'Equivalent Resistance',
        value: `Series: ${rSeries.toFixed(2)} Ω | Parallel: ${rParallel.toFixed(2)} Ω`,
        numericValue: rParallel,
        unit: 'Ω',
        formula: 'R_ser = R₁ + R₂,  R_par = (R₁ · R₂) / (R₁ + R₂)',
        steps: [
          `R_series = ${r1} + ${r2} = ${rSeries.toFixed(4)} Ω`,
          `R_parallel = (${r1} · ${r2}) / (${r1} + ${r2}) = ${r1 * r2} / ${r1 + r2} = ${rParallel.toFixed(4)} Ω`,
        ],
      }
    },
  },

  {
    id: 'rc-filter',
    name: 'RC Time Constant & Cutoff Frequency',
    category: 'electrical',
    badge: 'EE',
    description: 'Computes the charging time constant τ and the -3dB cutoff frequency for an RC circuit.',
    formula: 'τ = R · C  |  f_c = 1 / (2π · R · C)',
    variables: [
      { id: 'r', label: 'Resistance', symbol: 'R', unit: 'Ω', description: 'Series resistance', defaultValue: 10000, min: 0.001 },
      { id: 'c', label: 'Capacitance', symbol: 'C', unit: 'µF', description: 'Capacitance in microfarads', defaultValue: 0.1, min: 0.000001 },
    ],
    assumptions: ['Ideal lumped capacitor with negligible equivalent series resistance (ESR)'],
    calculate: (inputs) => {
      const r = inputs.r ?? 10000
      const cMicro = inputs.c ?? 0.1
      const cFarad = cMicro * 1e-6
      const tau = r * cFarad
      const fc = 1 / (2 * Math.PI * tau)
      return {
        resultLabel: 'Time Constant & Cutoff',
        value: `τ = ${(tau * 1000).toFixed(3)} ms | f_c = ${fc.toFixed(2)} Hz`,
        numericValue: fc,
        unit: 'Hz',
        formula: 'τ = R · C,  f_c = 1 / (2π · τ)',
        steps: [
          `Capacitance C = ${cMicro} µF = ${cFarad} F`,
          `Time Constant τ = ${r} · ${cFarad} = ${tau.toFixed(6)} s (${(tau * 1000).toFixed(3)} ms)`,
          `Cutoff Frequency f_c = 1 / (2 · π · ${tau.toFixed(6)}) = ${fc.toFixed(2)} Hz`,
        ],
      }
    },
  },

  {
    id: 'ac-impedance',
    name: 'AC Series RLC Reactance & Impedance',
    category: 'electrical',
    badge: 'EE',
    description: 'Calculates inductive reactance, capacitive reactance, and total impedance of a series RLC circuit.',
    formula: 'X_L = 2πfL  |  X_C = 1 / (2πfC)  |  Z = √(R² + (X_L - X_C)²)',
    variables: [
      { id: 'f', label: 'Frequency', symbol: 'f', unit: 'Hz', description: 'AC supply frequency', defaultValue: 50, min: 0.001 },
      { id: 'r', label: 'Resistance', symbol: 'R', unit: 'Ω', description: 'Series resistance', defaultValue: 50, min: 0 },
      { id: 'l', label: 'Inductance', symbol: 'L', unit: 'mH', description: 'Inductance in millihenries', defaultValue: 100, min: 0 },
      { id: 'c', label: 'Capacitance', symbol: 'C', unit: 'µF', description: 'Capacitance in microfarads', defaultValue: 10, min: 0.0001 },
    ],
    assumptions: ['Sinusoidal steady-state AC excitation', 'Linear passive components'],
    calculate: (inputs) => {
      const f = inputs.f ?? 50
      const r = inputs.r ?? 50
      const lH = (inputs.l ?? 100) * 1e-3
      const cF = (inputs.c ?? 10) * 1e-6

      const xl = 2 * Math.PI * f * lH
      const xc = 1 / (2 * Math.PI * f * cF)
      const xNet = xl - xc
      const z = Math.sqrt(r * r + xNet * xNet)
      const phaseRad = Math.atan2(xNet, r)
      const phaseDeg = (phaseRad * 180) / Math.PI

      return {
        resultLabel: 'Total Impedance',
        value: `${z.toFixed(2)} Ω ∠ ${phaseDeg.toFixed(1)}°`,
        numericValue: z,
        unit: 'Ω',
        formula: 'Z = √(R² + (X_L - X_C)²)',
        steps: [
          `Inductive Reactance X_L = 2 · π · ${f} · ${lH} = ${xl.toFixed(2)} Ω`,
          `Capacitive Reactance X_C = 1 / (2 · π · ${f} · ${cF}) = ${xc.toFixed(2)} Ω`,
          `Net Reactance X = X_L - X_C = ${xNet.toFixed(2)} Ω`,
          `Impedance Magnitude Z = √(${r}² + (${xNet.toFixed(2)})²) = ${z.toFixed(2)} Ω`,
          `Phase Angle θ = arctan(X/R) = ${phaseDeg.toFixed(2)}°`,
        ],
      }
    },
  },

  // ==========================================
  // MECHANICAL ENGINEERING
  // ==========================================
  {
    id: 'newtons-second-law',
    name: "Newton's Second Law of Motion",
    category: 'mechanical',
    badge: 'ME',
    description: 'Calculates the net force required to accelerate a body of given mass.',
    formula: 'F = m · a',
    variables: [
      { id: 'm', label: 'Mass', symbol: 'm', unit: 'kg', description: 'Mass of the object', defaultValue: 10, min: 0.001 },
      { id: 'a', label: 'Acceleration', symbol: 'a', unit: 'm/s²', description: 'Acceleration rate', defaultValue: 9.80665 },
    ],
    assumptions: ['Inertial reference frame', 'Constant mass (classical non-relativistic)'],
    calculate: (inputs) => {
      const m = inputs.m ?? 10
      const a = inputs.a ?? 9.80665
      const f = m * a
      return {
        resultLabel: 'Net Force',
        value: `${f.toFixed(3)} N`,
        numericValue: f,
        unit: 'N',
        formula: 'F = m · a',
        steps: [
          `Mass m = ${m} kg, Acceleration a = ${a} m/s²`,
          `Force F = ${m} · ${a} = ${f.toFixed(4)} N (${(f / 9.80665).toFixed(2)} kgf)`,
        ],
      }
    },
  },

  {
    id: 'stress-strain',
    name: "Mechanical Stress, Strain & Young's Modulus",
    category: 'mechanical',
    badge: 'ME',
    description: 'Calculates normal stress and engineering strain under axial tension or compression.',
    formula: 'σ = F / A  |  ε = ΔL / L₀  |  E = σ / ε',
    variables: [
      { id: 'f', label: 'Axial Force', symbol: 'F', unit: 'N', description: 'Tensile or compressive load', defaultValue: 15000, min: 0 },
      { id: 'area', label: 'Cross-Section Area', symbol: 'A', unit: 'mm²', description: 'Cross-sectional area', defaultValue: 100, min: 0.001 },
      { id: 'l0', label: 'Original Length', symbol: 'L₀', unit: 'mm', description: 'Initial gage length', defaultValue: 500, min: 0.001 },
      { id: 'dl', label: 'Elongation', symbol: 'ΔL', unit: 'mm', description: 'Change in length', defaultValue: 0.35, min: 0 },
    ],
    assumptions: ['Uniform axial stress distribution', 'Elastic deformation within proportional limit'],
    calculate: (inputs) => {
      const f = inputs.f ?? 15000
      const aMm2 = inputs.area ?? 100
      const l0 = inputs.l0 ?? 500
      const dl = inputs.dl ?? 0.35

      const aM2 = aMm2 * 1e-6
      const stressPa = f / aM2
      const stressMPa = stressPa / 1e6
      const strain = dl / l0
      const youngsModulusGPa = strain > 0 ? stressMPa / strain / 1000 : 0

      return {
        resultLabel: 'Stress & Strain',
        value: `σ = ${stressMPa.toFixed(2)} MPa | ε = ${(strain * 100).toFixed(4)}% | E = ${youngsModulusGPa.toFixed(1)} GPa`,
        numericValue: stressMPa,
        unit: 'MPa',
        formula: 'σ = F / A,  ε = ΔL / L₀,  E = σ / ε',
        steps: [
          `Cross-sectional area A = ${aMm2} mm² = ${aM2} m²`,
          `Normal Stress σ = ${f} / ${aM2} = ${stressPa.toFixed(0)} Pa = ${stressMPa.toFixed(2)} MPa (N/mm²)`,
          `Engineering Strain ε = ${dl} / ${l0} = ${strain.toFixed(6)} (${(strain * 100).toFixed(4)}%)`,
          `Young's Modulus E = ${stressMPa.toFixed(2)} MPa / ${strain.toFixed(6)} = ${(youngsModulusGPa).toFixed(2)} GPa`,
        ],
      }
    },
  },

  {
    id: 'torque',
    name: 'Torque / Moment of Force',
    category: 'mechanical',
    badge: 'ME',
    description: 'Calculates rotational torque exerted by a force at a radial lever arm distance.',
    formula: 'τ = F · r · sin(θ)',
    variables: [
      { id: 'f', label: 'Force', symbol: 'F', unit: 'N', description: 'Magnitude of applied force', defaultValue: 50, min: 0 },
      { id: 'r', label: 'Lever Arm', symbol: 'r', unit: 'm', description: 'Distance from rotation axis', defaultValue: 0.4, min: 0 },
      { id: 'theta', label: 'Angle', symbol: 'θ', unit: 'deg', description: 'Angle between force and lever arm', defaultValue: 90, min: 0, max: 180 },
    ],
    assumptions: ['Rigid lever arm', 'Static equilibrium assumption'],
    calculate: (inputs) => {
      const f = inputs.f ?? 50
      const r = inputs.r ?? 0.4
      const thetaDeg = inputs.theta ?? 90
      const thetaRad = (thetaDeg * Math.PI) / 180
      const torque = f * r * Math.sin(thetaRad)

      return {
        resultLabel: 'Torque',
        value: `${torque.toFixed(3)} N·m`,
        numericValue: torque,
        unit: 'N·m',
        formula: 'τ = F · r · sin(θ)',
        steps: [
          `Force F = ${f} N, Lever Arm r = ${r} m, Angle θ = ${thetaDeg}°`,
          `sin(${thetaDeg}°) = ${Math.sin(thetaRad).toFixed(4)}`,
          `Torque τ = ${f} · ${r} · ${Math.sin(thetaRad).toFixed(4)} = ${torque.toFixed(4)} N·m`,
        ],
      }
    },
  },

  {
    id: 'kinetic-potential-energy',
    name: 'Kinetic & Potential Energy',
    category: 'mechanical',
    badge: 'ME',
    description: 'Calculates mechanical kinetic energy and gravitational potential energy.',
    formula: 'E_k = ½ · m · v²  |  E_p = m · g · h',
    variables: [
      { id: 'm', label: 'Mass', symbol: 'm', unit: 'kg', description: 'Mass of the body', defaultValue: 5, min: 0.001 },
      { id: 'v', label: 'Velocity', symbol: 'v', unit: 'm/s', description: 'Speed of the body', defaultValue: 12, min: 0 },
      { id: 'h', label: 'Height', symbol: 'h', unit: 'm', description: 'Height above reference datum', defaultValue: 10 },
    ],
    assumptions: ['Earth gravitational acceleration g = 9.80665 m/s²', 'Point mass model'],
    calculate: (inputs) => {
      const m = inputs.m ?? 5
      const v = inputs.v ?? 12
      const h = inputs.h ?? 10
      const g = 9.80665

      const ek = 0.5 * m * v * v
      const ep = m * g * h
      const total = ek + ep

      return {
        resultLabel: 'Mechanical Energy',
        value: `E_total = ${total.toFixed(2)} J (Ek: ${ek.toFixed(2)} J, Ep: ${ep.toFixed(2)} J)`,
        numericValue: total,
        unit: 'J',
        formula: 'E_k = ½ · m · v²,  E_p = m · g · h',
        steps: [
          `Kinetic Energy E_k = 0.5 · ${m} · (${v})² = ${ek.toFixed(2)} J`,
          `Potential Energy E_p = ${m} · 9.80665 · ${h} = ${ep.toFixed(2)} J`,
          `Total Mechanical Energy E = E_k + E_p = ${total.toFixed(2)} J`,
        ],
      }
    },
  },

  {
    id: 'thermal-expansion',
    name: 'Thermal Linear Expansion',
    category: 'mechanical',
    badge: 'ME',
    description: 'Calculates dimensional expansion or contraction of a structural member under temperature change.',
    formula: 'ΔL = α · L₀ · ΔT',
    variables: [
      { id: 'l0', label: 'Initial Length', symbol: 'L₀', unit: 'm', description: 'Length at initial temperature', defaultValue: 10, min: 0.001 },
      { id: 'alpha', label: 'Thermal Coeff (α)', symbol: 'α', unit: '10⁻⁶/°C', description: 'Linear expansion coefficient (e.g. Steel ~12)', defaultValue: 12, min: 0 },
      { id: 'dt', label: 'Temp Difference', symbol: 'ΔT', unit: '°C', description: 'Change in temperature (T_final - T_initial)', defaultValue: 35 },
    ],
    assumptions: ['Isotropic material', 'Uniform temperature distribution across the section'],
    calculate: (inputs) => {
      const l0 = inputs.l0 ?? 10
      const alphaVal = (inputs.alpha ?? 12) * 1e-6
      const dt = inputs.dt ?? 35
      const dlM = alphaVal * l0 * dt
      const dlMm = dlM * 1000

      return {
        resultLabel: 'Length Expansion',
        value: `${dlMm.toFixed(3)} mm (New length: ${(l0 + dlM).toFixed(4)} m)`,
        numericValue: dlMm,
        unit: 'mm',
        formula: 'ΔL = α · L₀ · ΔT',
        steps: [
          `Expansion coefficient α = ${inputs.alpha ?? 12} × 10⁻⁶ / °C`,
          `Change in length ΔL = (${alphaVal}) · ${l0} m · ${dt} °C = ${dlM.toFixed(6)} m = ${dlMm.toFixed(3)} mm`,
          `Final Length L_f = ${l0} + ${dlM.toFixed(6)} = ${(l0 + dlM).toFixed(5)} m`,
        ],
      }
    },
  },

  // ==========================================
  // CIVIL ENGINEERING
  // ==========================================
  {
    id: 'concrete-volume',
    name: 'Concrete Slab & Footing Volume Estimator',
    category: 'civil',
    badge: 'CE',
    description: 'Estimates required ready-mix concrete volume and 50 kg cement bag equivalent for a slab.',
    formula: 'V = Length · Width · Thickness',
    variables: [
      { id: 'l', label: 'Length', symbol: 'L', unit: 'm', description: 'Slab length', defaultValue: 6, min: 0.01 },
      { id: 'w', label: 'Width', symbol: 'W', unit: 'm', description: 'Slab width', defaultValue: 4, min: 0.01 },
      { id: 't', label: 'Thickness', symbol: 'T', unit: 'm', description: 'Slab depth/thickness', defaultValue: 0.15, min: 0.01 },
      { id: 'waste', label: 'Waste Margin', symbol: 'W%', unit: '%', description: 'Waste allowance percentage', defaultValue: 5, min: 0 },
    ],
    assumptions: ['Rectangular prismatic geometry', 'Typical 1:2:4 nominal mix yielding ~0.035 m³ per 50kg bag'],
    calculate: (inputs) => {
      const l = inputs.l ?? 6
      const w = inputs.w ?? 4
      const t = inputs.t ?? 0.15
      const wastePct = inputs.waste ?? 5

      const netVol = l * w * t
      const grossVol = netVol * (1 + wastePct / 100)
      const bags50kg = Math.ceil(grossVol / 0.035)

      return {
        resultLabel: 'Concrete Volume',
        value: `${grossVol.toFixed(2)} m³ (~${bags50kg} bags of 50kg)`,
        numericValue: grossVol,
        unit: 'm³',
        formula: 'V_gross = L · W · T · (1 + Waste%)',
        steps: [
          `Net Volume = ${l} m · ${w} m · ${t} m = ${netVol.toFixed(3)} m³`,
          `With ${wastePct}% Waste Allowance = ${netVol.toFixed(3)} · ${(1 + wastePct / 100).toFixed(2)} = ${grossVol.toFixed(3)} m³`,
          `Estimated 50 kg cement bag count (@ 0.035 m³/bag) ≈ ${bags50kg} bags`,
        ],
        assumptions: ['Preliminary material estimate only; consult structural engineer for certified mixes.'],
      }
    },
  },

  {
    id: 'beam-bending-moment',
    name: 'Simply Supported Beam Bending & Shear',
    category: 'civil',
    badge: 'CE',
    description: 'Calculates maximum bending moment and maximum shear force for a simply supported beam with central point load.',
    formula: 'M_max = (P · L) / 4  |  V_max = P / 2',
    variables: [
      { id: 'span', label: 'Span Length', symbol: 'L', unit: 'm', description: 'Distance between supports', defaultValue: 5, min: 0.1 },
      { id: 'load', label: 'Center Point Load', symbol: 'P', unit: 'kN', description: 'Concentrated load at midspan', defaultValue: 20, min: 0.01 },
    ],
    assumptions: ['Prismatic Euler-Bernoulli beam', 'Elastic material behavior', 'Point load applied at exact midspan'],
    calculate: (inputs) => {
      const l = inputs.span ?? 5
      const p = inputs.load ?? 20
      const mMax = (p * l) / 4
      const vMax = p / 2

      return {
        resultLabel: 'Max Moment & Shear',
        value: `M_max = ${mMax.toFixed(2)} kN·m | V_max = ${vMax.toFixed(2)} kN`,
        numericValue: mMax,
        unit: 'kN·m',
        formula: 'M_max = (P · L) / 4,  V_max = P / 2',
        steps: [
          `Span L = ${l} m, Concentrated Load P = ${p} kN`,
          `Support Reactions R_A = R_B = P / 2 = ${vMax.toFixed(2)} kN`,
          `Maximum Shear Force V_max = ${vMax.toFixed(2)} kN`,
          `Maximum Bending Moment at midspan M_max = (${p} · ${l}) / 4 = ${mMax.toFixed(2)} kN·m`,
        ],
      }
    },
  },

  {
    id: 'slope-gradient',
    name: 'Slope, Grade & Incline Angle',
    category: 'civil',
    badge: 'CE',
    description: 'Calculates elevation grade percentage, pitch ratio, and incline angle from rise and run.',
    formula: 'Grade% = (Rise / Run) · 100  |  θ = arctan(Rise / Run)',
    variables: [
      { id: 'rise', label: 'Vertical Rise', symbol: 'Δy', unit: 'm', description: 'Vertical elevation change', defaultValue: 1.5 },
      { id: 'run', label: 'Horizontal Run', symbol: 'Δx', unit: 'm', description: 'Horizontal ground distance', defaultValue: 20, min: 0.001 },
    ],
    assumptions: ['Planar uniform grade over the measured run'],
    calculate: (inputs) => {
      const rise = inputs.rise ?? 1.5
      const run = inputs.run ?? 20
      if (run <= 0) throw new Error('Horizontal run must be strictly positive.')
      const grade = (rise / run) * 100
      const angleRad = Math.atan(rise / run)
      const angleDeg = (angleRad * 180) / Math.PI

      return {
        resultLabel: 'Slope Grade & Angle',
        value: `${grade.toFixed(2)}% (${angleDeg.toFixed(2)}°)`,
        numericValue: grade,
        unit: '%',
        formula: 'Grade% = (Rise / Run) · 100,  θ = arctan(Rise / Run)',
        steps: [
          `Rise = ${rise} m, Run = ${run} m`,
          `Slope Ratio = 1 : ${(run / rise).toFixed(1)}`,
          `Grade Percentage = (${rise} / ${run}) · 100 = ${grade.toFixed(2)}%`,
          `Angle of Incline θ = arctan(${rise} / ${run}) = ${angleDeg.toFixed(2)}°`,
        ],
      }
    },
  },

  // ==========================================
  // COMPUTER ENGINEERING
  // ==========================================
  {
    id: 'twos-complement',
    name: "Two's Complement Converter (8 / 16 / 32-bit)",
    category: 'computer',
    badge: 'CS',
    description: "Computes two's complement binary representation and bitwise inverted complement for signed integers.",
    formula: "Two's Comp = Invert Bits + 1",
    variables: [
      { id: 'val', label: 'Decimal Integer', symbol: 'n', unit: 'int', description: 'Signed integer value', defaultValue: -42 },
      { id: 'bits', label: 'Word Size', symbol: 'bits', unit: 'bits', description: '8, 16, or 32 bits', defaultValue: 8, min: 8, max: 32 },
    ],
    assumptions: ['Fixed-width binary arithmetic with truncation wrap-around'],
    calculate: (inputs) => {
      const n = Math.trunc(inputs.val ?? -42)
      let bits = inputs.bits ?? 8
      if (bits !== 8 && bits !== 16 && bits !== 32) bits = 8

      const minVal = -Math.pow(2, bits - 1)
      const maxVal = Math.pow(2, bits - 1) - 1

      if (n < minVal || n > maxVal) {
        throw new Error(`Value ${n} exceeds ${bits}-bit range [${minVal}, ${maxVal}].`)
      }

      const unsignedVal = n < 0 ? (Math.pow(2, bits) + n) : n
      const binStr = (unsignedVal >>> 0).toString(2).padStart(bits, '0')
      const hexStr = (unsignedVal >>> 0).toString(16).toUpperCase().padStart(bits / 4, '0')

      return {
        resultLabel: "Two's Complement Binary",
        value: `${binStr}₂ (0x${hexStr})`,
        numericValue: unsignedVal,
        unit: 'bin',
        formula: "Two's Complement for negative: 2^bits + n",
        steps: [
          `Range for ${bits}-bit signed: [${minVal}, ${maxVal}]`,
          `Input Integer: ${n}`,
          n < 0
            ? `Negative value: 2^${bits} + (${n}) = ${Math.pow(2, bits)} - ${Math.abs(n)} = ${unsignedVal}`
            : `Positive value directly encoded`,
          `Binary: ${binStr}₂`,
          `Hexadecimal: 0x${hexStr}`,
        ],
      }
    },
  },

  {
    id: 'data-storage-converter',
    name: 'Data Storage Unit Converter (Decimal vs Binary)',
    category: 'computer',
    badge: 'CS',
    description: 'Converts between SI decimal units (KB, MB, GB, TB) and IEC binary units (KiB, MiB, GiB, TiB).',
    formula: '1 KiB = 1024 Bytes  |  1 KB = 1000 Bytes',
    variables: [
      { id: 'val', label: 'Data Quantity', symbol: 'Q', unit: 'GB', description: 'Quantity in gigabytes (10⁹ B)', defaultValue: 128, min: 0.001 },
    ],
    assumptions: ['SI decimal uses powers of 1000, IEC binary uses powers of 1024'],
    calculate: (inputs) => {
      const gb = inputs.val ?? 128
      const totalBytes = gb * 1e9

      const mib = totalBytes / (1024 * 1024)
      const gib = totalBytes / (1024 * 1024 * 1024)

      return {
        resultLabel: 'True Binary Capacity',
        value: `${gib.toFixed(2)} GiB (${mib.toFixed(0)} MiB)`,
        numericValue: gib,
        unit: 'GiB',
        formula: 'GiB = (GB · 10⁹) / 2³⁰',
        steps: [
          `Advertised ${gb} GB = ${gb} × 10⁹ = ${totalBytes.toLocaleString()} Bytes`,
          `In IEC Mebibytes (MiB): ${mib.toFixed(2)} MiB`,
          `In IEC Gibibytes (GiB): ${totalBytes} / 1,073,741,824 = ${gib.toFixed(3)} GiB`,
          `Difference (Drive Capacity Paradox) ≈ ${(gb - gib).toFixed(2)} GB unaddressed due to 1000 vs 1024 standard`,
        ],
      }
    },
  },
]
