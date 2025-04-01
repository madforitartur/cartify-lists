
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

// Updated to indicate that a shopping list can only have shopping items,
// and a tasks list can only have task items
export interface ShoppingList {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  listType: ListType;
}

export interface ShoppingListWithItems extends ShoppingList {
  items: ShoppingItem[];
  listType: 'shopping';
}

export interface TaskListWithItems extends ShoppingList {
  items: TaskItem[];
  listType: 'tasks';
}

export type ListWithItems = ShoppingListWithItems | TaskListWithItems;

export type AppMode = 'shopping' | 'tasks';
