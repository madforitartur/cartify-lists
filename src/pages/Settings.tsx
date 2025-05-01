
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, Sun, Moon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppModeToggle from '@/components/AppModeToggle';
import { Link } from 'react-router-dom';
import InstallPwaButton from '@/components/InstallPwaButton';

const Settings = () => {
  const { settings, setAccentColor, setMode } = useTheme();

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 dark:text-white flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Configurações</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center">
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Início</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Modo da Aplicação</h2>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
              <AppModeToggle />
            </div>
          </section>

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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blue" id="blue" className="text-blue-500 border-blue-500" />
                    <Label htmlFor="blue" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-blue-500 mr-2"></span>
                      Azul
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="green" id="green" className="text-green-500 border-green-500" />
                    <Label htmlFor="green" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-green-500 mr-2"></span>
                      Verde
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="purple" id="purple" className="text-purple-500 border-purple-500" />
                    <Label htmlFor="purple" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-purple-500 mr-2"></span>
                      Roxo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="red" id="red" className="text-red-500 border-red-500" />
                    <Label htmlFor="red" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-red-500 mr-2"></span>
                      Vermelho
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pink" id="pink" className="text-pink-500 border-pink-500" />
                    <Label htmlFor="pink" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-pink-500 mr-2"></span>
                      Rosa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teal" id="teal" className="text-teal-500 border-teal-500" />
                    <Label htmlFor="teal" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-teal-500 mr-2"></span>
                      Teal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="orange" id="amber" className="text-orange-500 border-orange-500" />
                    <Label htmlFor="amber" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-orange-500 mr-2"></span>
                      Laranja
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="indigo" id="indigo" className="text-indigo-500 border-indigo-500" />
                    <Label htmlFor="indigo" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-indigo-500 mr-2"></span>
                      Índigo
                    </Label>
                  </div>
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="orange" id="tasks-orange" className="text-orange-500 border-orange-500" />
                    <Label htmlFor="tasks-orange" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-orange-500 mr-2"></span>
                      Laranja
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="green" id="tasks-green" className="text-green-500 border-green-500" />
                    <Label htmlFor="tasks-green" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-green-500 mr-2"></span>
                      Verde
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="purple" id="tasks-purple" className="text-purple-500 border-purple-500" />
                    <Label htmlFor="tasks-purple" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-purple-500 mr-2"></span>
                      Roxo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blue" id="tasks-blue" className="text-blue-500 border-blue-500" />
                    <Label htmlFor="tasks-blue" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-blue-500 mr-2"></span>
                      Azul
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="red" id="tasks-red" className="text-red-500 border-red-500" />
                    <Label htmlFor="tasks-red" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-red-500 mr-2"></span>
                      Vermelho
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pink" id="tasks-pink" className="text-pink-500 border-pink-500" />
                    <Label htmlFor="tasks-pink" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-pink-500 mr-2"></span>
                      Rosa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teal" id="tasks-teal" className="text-teal-500 border-teal-500" />
                    <Label htmlFor="tasks-teal" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-teal-500 mr-2"></span>
                      Teal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amber" id="tasks-amber" className="text-amber-500 border-amber-500" />
                    <Label htmlFor="tasks-amber" className="flex items-center cursor-pointer">
                      <span className="h-4 w-4 rounded-full bg-amber-500 mr-2"></span>
                      Âmbar
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Instalar Aplicação</h2>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-muted-foreground mb-4">
                Instale o Cartify no seu dispositivo para usar offline e ter uma experiência melhorada.
              </p>
              <InstallPwaButton />
            </div>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Sobre</h2>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-muted-foreground">
                Cartify v1.0.0 - Uma aplicação para gerenciar listas de compras e tarefas.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
