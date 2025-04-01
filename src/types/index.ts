
export type Category = 'fruits' | 'vegetables' | 'dairy' | 'meat' | 'bakery' | 'cleaning' | 'beverages' | 'default';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TaskCategory = 'general' | 'work' | 'personal' | 'health' | 'education' | 'home';

export interface BaseItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShoppingItem extends BaseItem {
  category: Category;
}

export interface TaskItem extends BaseItem {
  description?: string;
  priority: Priority;
  category: TaskCategory;
  dueDate?: Date | string;
}

export type ListType = 'shopping' | 'tasks';

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[] | TaskItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
  listType: ListType;
}

export type AppMode = 'shopping' | 'tasks';
