// Single source of truth for the menu, shared by React and the database seeder.
import data from './menu.json'

export const menu = data.categories
export const menuItems = data.items
