import { type IFoodHint } from '@hienpham512/smarteats'

const getNextPageParam = (url: string): string | null => {
  if (!url) return null

  const queryString = url.split('?')[1]

  if (queryString) {
    const queryParams = queryString.split('&')

    for (const param of queryParams) {
      const [key, value] = param.split('=')
      if (key === 'session' && value !== '') {
        // Check for a non-empty value
        return decodeURIComponent(value)
      }
    }
  }

  return null
}

const filterUniqueFoods = (foods: IFoodHint[]): IFoodHint[] => {
  const uniqueLabels: Record<string, boolean> = {}

  const filteredFoods = foods.filter((food) => {
    const lowercaseLabel = food.food.label.toLowerCase()

    if (!uniqueLabels[lowercaseLabel]) {
      uniqueLabels[lowercaseLabel] = true
      return true
    }

    return false
  })

  return filteredFoods
}

export { getNextPageParam, filterUniqueFoods }
