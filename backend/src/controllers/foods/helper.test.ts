import { getNextPageParam } from './helper'

describe('getNextPageParam', () => {
  it('should return null when URL is empty', () => {
    expect(getNextPageParam('')).toBeNull()
  })

  it('should return null when URL does not contain query string', () => {
    expect(getNextPageParam('https://example.com')).toBeNull()
  })

  it('should return null when "session" parameter is empty', () => {
    expect(getNextPageParam('https://example.com?page=2&session=')).toBeNull()
  })

  it('should return null when "session" parameter is not found', () => {
    expect(getNextPageParam('https://example.com?page=2')).toBeNull()
  })

  it('should return the value of "session" parameter', () => {
    expect(getNextPageParam('https://example.com?page=2&session=123456')).toEqual('123456')
  })

  it('should decode the value of "session" parameter', () => {
    expect(getNextPageParam('https://example.com?page=2&session=%21%40%23%24')).toEqual('!@#$')
  })

  it('should handle multiple parameters and return the value of "session" parameter', () => {
    expect(getNextPageParam('https://example.com?page=2&session=123456&other=value')).toEqual(
      '123456',
    )
  })

  it('should handle special characters in parameter values', () => {
    expect(getNextPageParam('https://example.com?page=2&session=%20%26%20')).toEqual(' & ')
  })
})
