import { getNextPageParam, getParamValue } from './helper'

describe('getNextPageParam', () => {
  it('should return the _cont parameter value when it is present', () => {
    const url = 'https://example.com/api/endpoint?_cont=ShortURLValue'
    const result = getNextPageParam(url)
    expect(result).toBe('ShortURLValue')
  })

  it('should return null when _cont parameter is not present', () => {
    const url = 'https://example.com/api/endpoint?foo=bar'
    const result = getNextPageParam(url)
    expect(result).toBeNull()
  })

  it('should return null when _cont parameter has an empty value', () => {
    const url = 'https://example.com/api/endpoint?_cont='
    const result = getNextPageParam(url)
    expect(result).toBeNull()
  })

  it('should return null for an empty URL', () => {
    const url = ''
    const result = getNextPageParam(url)
    expect(result).toBeNull()
  })
})

describe('getParamValue', () => {
  it('should replace plus signs with %2B in the input', () => {
    const input = '1+2+3'
    const expectedOutput = '1%2B2%2B3'
    const result = getParamValue(input)
    expect(result).toBe(expectedOutput)
  })

  it('should return undefined if the input is empty', () => {
    const input = ''
    const result = getParamValue(input)
    expect(result).toBeUndefined()
  })

  it('should return undefined if the input is undefined', () => {
    const input = undefined
    const result = getParamValue(input)
    expect(result).toBeUndefined()
  })

  it('should not modify the input if it contains no plus signs', () => {
    const input = 'abcdef'
    const result = getParamValue(input)
    expect(result).toBe(input)
  })
})
