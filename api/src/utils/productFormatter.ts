// utils/productFormatter.ts
import { formatCurrency } from './currencyFormatter';  // Import the currency formatter

/**
 * Formats a product by converting the price to unitPrice and removing unnecessary fields.
 * @param product - The product to format.
 * @param currency - The currency code to format the price (default: 'EUR').
 * @returns The formatted product.
 */
export const formatProduct = (product: any, currency: string = 'EUR') => {
  // Format price to unitPrice and remove the original `price`
  const formattedProduct = { ...product };
  
  // Ensure that `price` exists and format it to `unitPrice`
  formattedProduct.unitPrice = formatCurrency(Number(formattedProduct.price), currency);
  
  // Remove `price`, `_id`, and `__v`
  delete formattedProduct.price;
  delete formattedProduct._id;
  delete formattedProduct.__v;

  return formattedProduct;
};
