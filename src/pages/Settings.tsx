
import React from 'react';
import { ShoppingListProvider } from '@/contexts/shopping-list';
import SettingsHeader from '@/components/settings/SettingsHeader';
import ThemeSection from '@/components/settings/ThemeSection';
import AppModeSection from '@/components/settings/AppModeSection';
import InstallSection from '@/components/settings/InstallSection';
import AboutSection from '@/components/settings/AboutSection';

const Settings = () => {
  return (
    <ShoppingListProvider>
      <div className="min-h-screen bg-background dark:bg-slate-900 dark:text-white flex flex-col">
        <SettingsHeader />

        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            <AppModeSection />
            <ThemeSection />
            <InstallSection />
            <AboutSection />
          </div>
        </main>
      </div>
    </ShoppingListProvider>
  );
};

export default Settings;
