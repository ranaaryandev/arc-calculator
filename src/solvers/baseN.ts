/**
 * Arc Calculator 2.0 — Base-N Number Systems Engine
 * Supports Decimal, Binary, Octal, Hexadecimal conversions, bitwise logic, and two's complement.
 */

export type NumberBase = 'DEC' | 'BIN' | 'OCT' | 'HEX'
export type WordSize = 8 | 16 | 32

export interface BaseNConversion {
  dec: string
  bin: string
  oct: string
  hex: string
  unsignedDec: string
  signedDec: string
}

export function isValidBaseString(str: string, base: NumberBase): boolean {
  const trimmed = str.trim().toUpperCase()
  if (!trimmed) return false

  switch (base) {
    case 'BIN':
      return /^[01]+$/.test(trimmed)
    case 'OCT':
      return /^[0-7]+$/.test(trimmed)
    case 'DEC':
      return /^-?[0-9]+$/.test(trimmed)
    case 'HEX':
      return /^[0-9A-F]+$/.test(trimmed)
  }
}

export function parseBaseStringToBigInt(str: string, base: NumberBase): bigint {
  const clean = str.trim()
  if (!isValidBaseString(clean, base)) {
    throw new Error(`Invalid characters for base ${base}: "${str}"`)
  }

  switch (base) {
    case 'BIN':
      return BigInt('0b' + clean)
    case 'OCT':
      return BigInt('0o' + clean)
    case 'HEX':
      return BigInt('0x' + clean)
    case 'DEC':
      return BigInt(clean)
  }
}

export function formatBaseN(val: bigint, wordSize: WordSize = 32): BaseNConversion {
  const mask = (1n << BigInt(wordSize)) - 1n
  const unsigned = val & mask

  // Signed 2's complement
  const signBit = 1n << BigInt(wordSize - 1)
  const isNegative = (unsigned & signBit) !== 0n
  const signed = isNegative ? unsigned - (1n << BigInt(wordSize)) : unsigned

  const binStr = unsigned.toString(2).padStart(wordSize, '0')
  const octStr = unsigned.toString(8)
  const hexStr = unsigned.toString(16).toUpperCase()

  return {
    dec: val.toString(10),
    bin: binStr,
    oct: octStr,
    hex: hexStr,
    unsignedDec: unsigned.toString(10),
    signedDec: signed.toString(10),
  }
}

export function bitwiseOperation(
  aStr: string,
  bStr: string,
  op: 'AND' | 'OR' | 'XOR' | 'SHL' | 'SHR',
  base: NumberBase,
  wordSize: WordSize = 32
): BaseNConversion {
  const a = parseBaseStringToBigInt(aStr, base)
  const b = parseBaseStringToBigInt(bStr, base)
  const mask = (1n << BigInt(wordSize)) - 1n

  let res = 0n
  switch (op) {
    case 'AND':
      res = (a & b) & mask
      break
    case 'OR':
      res = (a | b) & mask
      break
    case 'XOR':
      res = (a ^ b) & mask
      break
    case 'SHL':
      res = (a << (b & 31n)) & mask
      break
    case 'SHR':
      res = (a >> (b & 31n)) & mask
      break
  }

  return formatBaseN(res, wordSize)
}

export function bitwiseNot(aStr: string, base: NumberBase, wordSize: WordSize = 32): BaseNConversion {
  const a = parseBaseStringToBigInt(aStr, base)
  const mask = (1n << BigInt(wordSize)) - 1n
  const res = (~a) & mask
  return formatBaseN(res, wordSize)
}
