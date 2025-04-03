
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare } from 'lucide-react';
import { AppMode } from '@/types';
import { useCurrencyFormatter } from '@/utils/formatters';
import { useTheme } from '@/contexts/ThemeContext';

interface ListViewSummaryProps {
  mode: AppMode;
  totalPrice: number;
  handleAddItem: () => void;
}

const ListViewSummary: React.FC<ListViewSummaryProps> = ({
  mode,
  totalPrice,
  handleAddItem
}) => {
  const formatCurrency = useCurrencyFormatter();
  const { getAccentColorClass } = useTheme();

  return (
    <div className={`bg-card border rounded-lg p-4 flex items-center justify-between mb-6 
      ${mode === 'tasks' ? `${getAccentColorClass('tasks', 'border')}/20` : 'border-primary/20'}`}>
      {mode === 'shopping' ? (
        <>
          <div>
            <p className="text-sm text-muted-foreground">Valor Total Estimado</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalPrice)}</p>
          </div>
          <Button onClick={handleAddItem} className={getAccentColorClass('shopping', 'bg')}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </>
      ) : (
        <>
          <div>
            <p className="text-sm text-muted-foreground">Progresso</p>
            <p className={`text-2xl font-semibold ${getAccentColorClass('tasks', 'text')}`}>
              {totalPrice > 0 ? Math.round(totalPrice) : 0}%
            </p>
          </div>
          <Button onClick={handleAddItem} className={getAccentColorClass('tasks', 'bg')}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Adicionar Tarefa</span>
          </Button>
        </>
      )}
    </div>
  );
};

export default ListViewSummary;
