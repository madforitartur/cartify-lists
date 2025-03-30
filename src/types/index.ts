
export type Category = 
  | 'fruits' 
  | 'dairy' 
  | 'cleaning' 
  | 'bakery' 
  | 'meat' 
  | 'beverages' 
  | 'default';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  category: Category;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}
