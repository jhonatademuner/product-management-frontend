export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  isBelowMinimumStock?: boolean;
}
