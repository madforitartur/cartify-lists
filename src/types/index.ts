
export type Category = 
  | 'fruits' 
  | 'dairy' 
  | 'cleaning' 
  | 'bakery' 
  | 'meat' 
  | 'beverages' 
  | 'default';

export type TaskCategory =
  | 'work'
  | 'personal'
  | 'health'
  | 'education'
  | 'home'
  | 'default';

export type Priority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type AppMode = 'shopping' | 'tasks';

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

export interface TaskItem {
  id: string;
  name: string;
  priority: Priority;
  category: TaskCategory;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ListItem = ShoppingItem | TaskItem;

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskList {
  id: string;
  name: string;
  items: TaskItem[];
  createdAt: string;
  updatedAt: string;
}

export type ListType = ShoppingList | TaskList;

// Helper type guard functions
export const isShoppingItem = (item: ListItem): item is ShoppingItem => 
  'price' in item && 'quantity' in item;

export const isTaskItem = (item: ListItem): item is TaskItem => 
  'priority' in item && 'dueDate' in item;

export const isShoppingList = (list: ListType): list is ShoppingList => 
  list.items.length === 0 || (list.items.length > 0 && 'price' in list.items[0]);

export const isTaskList = (list: ListType): list is TaskList => 
  list.items.length === 0 || (list.items.length > 0 && 'priority' in list.items[0]);
