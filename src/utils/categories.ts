
import { Category } from '@/types';
import { 
  Apple, Beef, Milk, ShoppingBag, Cake, Wine, ShoppingBasket
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CategoryInfo {
  label: string;
  icon: LucideIcon;
  className: string;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  fruits: {
    label: 'Frutas',
    icon: Apple,
    className: 'bg-category-fruits/10 text-category-fruits border-category-fruits/20'
  },
  dairy: {
    label: 'Laticínios',
    icon: Milk,
    className: 'bg-category-dairy/10 text-category-dairy border-category-dairy/20'
  },
  cleaning: {
    label: 'Limpeza',
    icon: ShoppingBag,
    className: 'bg-category-cleaning/10 text-category-cleaning border-category-cleaning/20'
  },
  bakery: {
    label: 'Padaria',
    icon: Cake,
    className: 'bg-category-bakery/10 text-category-bakery border-category-bakery/20'
  },
  meat: {
    label: 'Carnes',
    icon: Beef,
    className: 'bg-category-meat/10 text-category-meat border-category-meat/20'
  },
  beverages: {
    label: 'Bebidas',
    icon: Wine,
    className: 'bg-category-beverages/10 text-category-beverages border-category-beverages/20'
  },
  default: {
    label: 'Outros',
    icon: ShoppingBasket,
    className: 'bg-category-default/10 text-category-default border-category-default/20'
  }
};

export const getCategoryInfo = (category: Category): CategoryInfo => {
  return CATEGORIES[category] || CATEGORIES.default;
};

export const getCategoryOptions = (): Array<{value: Category, label: string}> => {
  return Object.entries(CATEGORIES).map(([value, info]) => ({
    value: value as Category,
    label: info.label
  }));
};
