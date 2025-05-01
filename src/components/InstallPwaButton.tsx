
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from "sonner";

// Definindo a interface para o evento BeforeInstallPrompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Adicionando a interface global para o window
declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
    'appinstalled': Event;
  }
}

const InstallPwaButton = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log("Aplicativo já está instalado (modo standalone)");
      setIsInstalled(true);
      return;
    }

    // Store the install prompt event for later use
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      console.log("Evento beforeinstallprompt capturado", e);
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app install
    window.addEventListener('appinstalled', () => {
      console.log("Aplicativo instalado com sucesso");
      toast.success("Aplicativo instalado com sucesso!");
      setIsInstalled(true);
      setIsInstallable(false);
    });

    // Verificação adicional de compatibilidade
    const checkPwaCompat = () => {
      const isPwa = 
        'serviceWorker' in navigator && 
        window.matchMedia('(display-mode: browser)').matches &&
        !isInstalled;
      
      console.log("Compatibilidade PWA:", {
        serviceWorker: 'serviceWorker' in navigator,
        browserMode: window.matchMedia('(display-mode: browser)').matches,
        notInstalled: !isInstalled
      });
      
      return isPwa;
    };
    
    // Se o prompt não for acionado automaticamente em alguns navegadores
    if (!isInstallable && !isInstalled && checkPwaCompat()) {
      console.log("PWA é compatível, mas o prompt não foi acionado automaticamente");
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!installPrompt) {
      console.log("Nenhum prompt de instalação disponível");
      return;
    }

    console.log("Mostrando prompt de instalação");
    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    console.log("Resultado da escolha do usuário:", choiceResult.outcome);

    // Reset the install prompt - it can only be used once
    setInstallPrompt(null);

    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
    } else {
      console.log('Usuário recusou a instalação');
      toast.error("Instalação cancelada");
    }
  };

  // Se já instalado, mostrar mensagem instalado
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

  // Se não for instalável, mostrar mensagem
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
