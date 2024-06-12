const getNextPageParam = (url: string): string | null => {
  if (!url) return null

  const queryString = url.split('?')[1]

  if (queryString) {
    const queryParams = queryString.split('&')

    for (const param of queryParams) {
      const [key, value] = param.split('=')
      if (key === '_cont' && value !== '') {
        // Check for a non-empty value
        return decodeURIComponent(value)
      }
    }
  }

  return null
}

const getParamValue = (value: string | undefined): string | undefined => {
  if (!value) return undefined

  return value.replace(/\+/g, '%2B')
}

export { getNextPageParam, getParamValue }
