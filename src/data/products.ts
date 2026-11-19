export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;

/** "Sauce Labs Backpack" -> "sauce-labs-backpack" (the app uses this in data-test ids) */
export const toSlug = (name: string): string => name.toLowerCase().replace(/\s+/g, '-');

/** "$29.99" or "Item total: $29.99" -> 29.99 */
export const toPrice = (text: string): number => Number(text.replace(/[^0-9.]/g, ''));
