
import React from 'react';
import InstallPwaButton from '@/components/InstallPwaButton';

const InstallSection = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Instalar Aplicação</h2>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-muted-foreground mb-4">
          Instale o Cartify no seu dispositivo para usar offline e ter uma experiência melhorada.
        </p>
        <InstallPwaButton />
      </div>
    </section>
  );
};

export default InstallSection;
