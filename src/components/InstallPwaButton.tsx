
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPwaButton = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Store the install prompt event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app install
    window.addEventListener('appinstalled', () => {
      toast.success("Aplicativo instalado com sucesso!");
      setIsInstalled(true);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;

    // Reset the install prompt - it can only be used once
    setInstallPrompt(null);

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      toast.error("Instalação cancelada");
    }
  };

  // If already installed, show installed message
  if (isInstalled) {
    return (
      <Button 
        variant="outline"
        className="flex items-center gap-2 w-full opacity-70 cursor-not-allowed"
        disabled
      >
        <Download className="h-4 w-4" />
        Aplicativo já instalado
      </Button>
    );
  }

  // If not installable, show a message
  if (!isInstallable) {
    return (
      <Button 
        variant="outline"
        className="flex items-center gap-2 w-full opacity-70 cursor-not-allowed"
        disabled
        title="Este navegador não suporta instalação de PWA ou o aplicativo já está instalado"
      >
        <Download className="h-4 w-4" />
        Instalação não disponível
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleInstall} 
      variant="default"
      className="flex items-center gap-2 w-full"
    >
      <Download className="h-4 w-4" />
      Instalar App
    </Button>
  );
};

export default InstallPwaButton;
