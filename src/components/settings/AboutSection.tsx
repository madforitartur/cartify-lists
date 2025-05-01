
import React from 'react';

const AboutSection = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Sobre</h2>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-muted-foreground">
          Cartify v1.0.0 - Uma aplicação para gerenciar listas de compras e tarefas.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
