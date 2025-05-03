
import React from 'react';
import AppModeToggle from '@/components/AppModeToggle';
import { 
  Select, 
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { DollarSign, Euro } from 'lucide-react';

const AppModeSection = () => {
  const { settings, setCurrency } = useTheme();

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Modo da Aplicação</h2>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
        <AppModeToggle />
        <p className="text-xs text-muted-foreground mt-2">
          Alterne entre os modos de compras e tarefas sem notificações.
        </p>
      </div>

      <h2 className="text-lg font-medium">Moeda</h2>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <span>Selecione sua moeda:</span>
          <Select 
            value={settings.currency} 
            onValueChange={(value) => setCurrency(value as 'BRL' | 'USD' | 'EUR')}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Moeda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">
                <div className="flex items-center">
                  <span className="mr-2">R$</span>
                  <span>Real (BRL)</span>
                </div>
              </SelectItem>
              <SelectItem value="USD">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Dólar (USD)</span>
                </div>
              </SelectItem>
              <SelectItem value="EUR">
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-2" />
                  <span>Euro (EUR)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Escolha a moeda para exibir os preços na aplicação.
        </p>
      </div>
    </section>
  );
};

export default AppModeSection;
