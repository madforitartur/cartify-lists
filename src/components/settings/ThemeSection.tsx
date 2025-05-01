
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSection = () => {
  const { settings, setAccentColor, setMode } = useTheme();

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Tema</h2>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center justify-between">
          <span>Modo Escuro</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setMode(settings.mode === 'dark' ? 'light' : 'dark')}
            aria-label={settings.mode === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {settings.mode === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div>
          <Label className="mb-2 block">Cor de Destaque para Compras</Label>
          <RadioGroup 
            defaultValue={settings.shoppingAccentColor} 
            value={settings.shoppingAccentColor}
            onValueChange={(value) => setAccentColor('shopping', value as any)}
            className="flex flex-wrap gap-3"
          >
            <ColorOption color="blue" label="Azul" />
            <ColorOption color="green" label="Verde" />
            <ColorOption color="purple" label="Roxo" />
            <ColorOption color="red" label="Vermelho" />
            <ColorOption color="pink" label="Rosa" />
            <ColorOption color="teal" label="Teal" />
            <ColorOption color="orange" label="Laranja" />
            <ColorOption color="indigo" label="Índigo" />
          </RadioGroup>
        </div>
        
        <div>
          <Label className="mb-2 block">Cor de Destaque para Tarefas</Label>
          <RadioGroup 
            defaultValue={settings.tasksAccentColor}
            value={settings.tasksAccentColor}
            onValueChange={(value) => setAccentColor('tasks', value as any)}
            className="flex flex-wrap gap-3"
          >
            <ColorOption color="orange" id="tasks-" label="Laranja" />
            <ColorOption color="green" id="tasks-" label="Verde" />
            <ColorOption color="purple" id="tasks-" label="Roxo" />
            <ColorOption color="blue" id="tasks-" label="Azul" />
            <ColorOption color="red" id="tasks-" label="Vermelho" />
            <ColorOption color="pink" id="tasks-" label="Rosa" />
            <ColorOption color="teal" id="tasks-" label="Teal" />
            <ColorOption color="amber" id="tasks-" label="Âmbar" />
          </RadioGroup>
        </div>
      </div>
    </section>
  );
};

interface ColorOptionProps {
  color: string;
  label: string;
  id?: string;
}

const ColorOption = ({ color, label, id = '' }: ColorOptionProps) => {
  const idValue = id ? `${id}${color}` : color;
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={color} id={idValue} className={`text-${color}-500 border-${color}-500`} />
      <Label htmlFor={idValue} className="flex items-center cursor-pointer">
        <span className={`h-4 w-4 rounded-full bg-${color}-500 mr-2`}></span>
        {label}
      </Label>
    </div>
  );
};

export default ThemeSection;
