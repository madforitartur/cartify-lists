
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsHeader = () => {
  return (
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
  );
};

export default SettingsHeader;
