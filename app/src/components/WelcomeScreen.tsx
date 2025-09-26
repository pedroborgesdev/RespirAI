import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Brain } from "lucide-react";

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export const WelcomeScreen = ({ onStartChat }: WelcomeScreenProps) => {
  return (
    // Container principal para centralizar o conteúdo na tela
    <div className="flex flex-col items-center justify-center p-8 bg-background min-h-screen">
      <div className="text-center max-w-md mx-auto w-full">

        {/* Logo/Ícone simplificado */}
        <div className="mb-8">
          <div className="w-28 h-28 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
            <Brain className="w-14 h-14 text-white" />
          </div>
        </div>

        {/* Título Principal */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Respir<span className="text-primary">AI</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Seu assistente de saúde
          </p>
        </div>

        {/* Descrição curta e direta */}
        <p className="text-base text-muted-foreground mb-10 leading-relaxed">
          Descreva seus sintomas e receba uma orientação sobre qual profissional procurar.
        </p>

        {/* Botão de Ação */}
        <Button
          onClick={onStartChat}
          size="lg"
          className="w-full bg-gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-smooth font-semibold py-4 text-base"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Começar a conversar
        </Button>

        {/* Aviso Legal simplificado */}
        <div className="mt-8">
          <p className="text-xs text-muted-foreground leading-relaxed px-4">
            <Heart className="w-3 h-3 inline mr-1.5 align-middle" />
            Este assistente oferece orientações e não substitui uma consulta médica.
          </p>
        </div>

      </div>
    </div>
  );
};