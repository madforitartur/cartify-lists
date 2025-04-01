
export type Category = 'fruits' | 'vegetables' | 'dairy' | 'meat' | 'bakery' | 'cleaning' | 'beverages' | 'default';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TaskCategory = 'general' | 'work' | 'personal' | 'health' | 'education' | 'home';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  category: Category;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  price: number;
  priority: Priority;
  category: TaskCategory;
  completed: boolean;
  dueDate?: Date | string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[] | TaskItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type AppMode = 'shopping' | 'tasks';
