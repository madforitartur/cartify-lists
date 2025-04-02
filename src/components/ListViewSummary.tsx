
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AppMode } from '@/types';
import { formatCurrency } from '@/utils/formatters';

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
  return (
    <div className="bg-card border rounded-lg p-4 flex items-center justify-between mb-6">
      {mode === 'shopping' ? (
        <>
          <div>
            <p className="text-sm text-muted-foreground">Valor Total Estimado</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalPrice)}</p>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </>
      ) : (
        <>
          <div>
            <p className="text-sm text-muted-foreground">Progresso</p>
            <p className="text-2xl font-semibold">
              {totalPrice > 0 ? Math.round(totalPrice) : 0}%
            </p>
          </div>
          <Button onClick={handleAddItem} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Button>
        </>
      )}
    </div>
  );
};

export default ListViewSummary;
