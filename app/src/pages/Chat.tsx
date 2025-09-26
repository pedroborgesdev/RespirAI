import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ChatInput } from "@/components/ChatInput";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { sendSymptomMessage } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
// 1. Remova a importação do 'useIonBackButton' e adicione a do 'App' do Capacitor
import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';


interface ChatProps {
  onBack: () => void;
}

export const Chat = ({ onBack }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 2. Substitua o hook 'useIonBackButton' por 'useEffect' para escutar o evento do hardware
  useEffect(() => {
    let listenerHandle: PluginListenerHandle;

    const addListener = async () => {
      // Adiciona um "escutador" para o evento do botão de voltar nativo
      listenerHandle = await App.addListener('backButton', () => {
        onBack();
      });
    };

    // Registra o listener ao montar o componente
    addListener();

    // A função de limpeza remove o listener quando o componente é desmontado para evitar fugas de memória
    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [onBack]); // A dependência [onBack] garante que o listener seja atualizado se a função mudar

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Aqui você pode trocar por sendSymptomMessage(content) quando a API estiver configurada
      const aiResponse = await sendSymptomMessage(content);
      
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast({
      title: "Conversa limpa",
      description: "O histórico foi apagado. Você pode começar uma nova conversa.",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 pt-10 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">RespirAI</h1>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Analisando..." : "Pronto para ajudar"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            disabled={messages.length === 0}
            className="hover:bg-accent"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-soft max-w-sm">
              <h3 className="font-semibold text-foreground mb-2">Como posso ajudar?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Descreva seus sintomas de forma natural. Por exemplo:
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• "Sinto dor de cabeça e náusea"</p>
                <p>• "Estou com ansiedade e insônia"</p>
                <p>• "Tenho dor nas costas há 3 dias"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

