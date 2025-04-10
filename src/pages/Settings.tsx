
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppMode } from '@/contexts/AppModeContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ArrowLeft, Palette } from 'lucide-react';

const Settings = () => {
  const { settings, setMode, setCurrency, setAccentColor } = useTheme();
  const { mode } = useAppMode();
  
  // Color mapping for visual display of color options
  const colorClasses = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    teal: 'bg-teal-500',
    indigo: 'bg-indigo-500'
  };
  
  // Define a consistent color order for both shopping and tasks modes
  const colorOrder = ['purple', 'blue', 'green', 'red', 'orange', 'pink', 'teal', 'indigo'];
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </a>
        </Button>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência com o Cartify</p>
      </div>

      <div className="grid gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {settings.mode === 'dark' ? (
                <Moon className="mr-2 h-5 w-5" />
              ) : (
                <Sun className="mr-2 h-5 w-5" />
              )}
              Aparência
            </CardTitle>
            <CardDescription>
              Altere entre os temas claro e escuro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={settings.mode === 'light' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setMode('light')}
              >
                <Sun className="h-6 w-6" />
                <span>Claro</span>
              </Button>
              <Button
                variant={settings.mode === 'dark' ? 'default' : 'outline'} 
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => setMode('dark')}
              >
                <Moon className="h-6 w-6" />
                <span>Escuro</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Moeda</CardTitle>
            <CardDescription>
              Selecione a moeda a ser utilizada no aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select 
                  value={settings.currency} 
                  onValueChange={(value) => setCurrency(value as any)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Selecione uma moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Moedas</SelectLabel>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colors Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Cores
            </CardTitle>
            <CardDescription>
              Personalize as cores dos modos Compras e Tarefas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Cor do Modo Compras</Label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOrder.map((color) => (
                    <Button 
                      key={color}
                      variant="outline"
                      className={`h-10 w-full ${
                        color === settings.shoppingAccentColor ? 'ring-2 ring-offset-2' : ''
                      } ${colorClasses[color as keyof typeof colorClasses]}`}
                      onClick={() => setAccentColor('shopping', color as any)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cor do Modo Tarefas</Label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOrder.map((color) => (
                    <Button 
                      key={color}
                      variant="outline"
                      className={`h-10 w-full ${
                        color === settings.tasksAccentColor ? 'ring-2 ring-offset-2' : ''
                      } ${colorClasses[color as keyof typeof colorClasses]}`}
                      onClick={() => setAccentColor('tasks', color as any)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              As alterações são salvas automaticamente.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
