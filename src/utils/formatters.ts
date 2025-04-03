
import { useTheme } from '@/contexts/ThemeContext';

// Get currency formatter based on context
export const useCurrencyFormatter = () => {
  const { settings, getCurrencySymbol } = useTheme();
  
  return (amount: number): string => {
    return `${getCurrencySymbol()} ${amount.toFixed(2).replace('.', ',')}`;
  };
};

// Format currency when outside of components (fallback to BRL)
export const formatCurrency = (amount: number): string => {
  try {
    // Try to get from localStorage if available
    const settingsStr = localStorage.getItem('cartify-theme-settings');
    if (settingsStr) {
      const settings = JSON.parse(settingsStr);
      const currencySymbols: Record<string, string> = {
        'BRL': 'R$',
        'USD': '$',
        'EUR': '€'
      };
      const symbol = currencySymbols[settings.currency] || 'R$';
      return `${symbol} ${amount.toFixed(2).replace('.', ',')}`;
    }
    
    // Default to BRL
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  } catch (e) {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  }
};

// Format date
export const formatDate = (date: string | Date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR');
};
