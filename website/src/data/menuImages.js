// Starter photos for the menu rows. Replace any file in website/public/images/
// with a real photo of the item and it will appear here automatically.

const photo = (name) => `/images/${name}.svg`

export function itemImage(itemName, categoryId, groupLabel) {
  const name = itemName.toLowerCase()
  const group = (groupLabel || '').toLowerCase()

  if (categoryId === 'breakfast') return photo('breakfast')
  if (categoryId === 'lunch') return photo('lunch')

  if (name.includes('shake') || name.includes('smoothie')) return photo('shake')
  if (name.includes('mojito')) return photo('mojito')
  if (name.includes('pizza')) return photo('pizza')
  if (name.includes('burger') || name.includes('chips')) return photo('burger')
  if (name.includes('sandwich') || name.includes('burrito')) return photo('burger')
  if (name.includes('salad') || name.includes('timatim')) return photo('lunch')
  if (name.includes('punch')) return photo('juice')
  if (
    name.includes('water') ||
    name.includes('cup') ||
    name.includes('box') ||
    name.includes('yogurt') ||
    name.includes('soft drink')
  ) {
    return photo('juice')
  }

  if (
    name.includes('tea') ||
    name.includes('keshir') ||
    name.includes('corenti') ||
    name.includes('coffee') ||
    name.includes('macchiato') ||
    name.includes('espresso') ||
    name.includes('americano') ||
    name.includes('cappuccino') ||
    name.includes('latte') ||
    name.includes('chocolate') ||
    name.includes('caramel') ||
    name.includes('milk')
  ) {
    return photo('coffee')
  }

  if (
    name.includes('juice') ||
    name.includes('avocado') ||
    name.includes('papaya') ||
    name.includes('mango') ||
    name.includes('pineapple') ||
    name.includes('watermelon') ||
    name.includes('orange') ||
    name.includes('telba') ||
    name.includes('beso') ||
    name.includes('mixed')
  ) {
    return photo('juice')
  }

  if (group.includes('mojito')) return photo('mojito')
  if (group.includes('shake') || group.includes('smoothie')) return photo('shake')
  if (group.includes('juice')) return photo('juice')
  if (group.includes('pizza')) return photo('pizza')
  if (group.includes('burger') || group.includes('sandwich') || group.includes('burrito')) {
    return photo('burger')
  }
  if (group.includes('salad')) return photo('lunch')
  if (group.includes('hot') || group.includes('iced')) return photo('coffee')

  return photo('lunch')
}
