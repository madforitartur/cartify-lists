
import React from 'react';
import AppModeToggle from '@/components/AppModeToggle';

const AppModeSection = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Modo da Aplicação</h2>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
        <AppModeToggle />
      </div>
    </section>
  );
};

export default AppModeSection;
