import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] px-4 py-3 rounded-2xl shadow-chat",
        
        // Aplica estilos base de tipografia e ajusta para o tema escuro
        "prose prose-sm prose-invert",
        
        // 💡 A MÁGICA ACONTECE AQUI!
        // Força a cor do texto em negrito para branco no modo escuro.
        "prose-strong:text-white", 
        
        isUser 
          ? "bg-chat-user text-white rounded-br-md" 
          : "bg-chat-ai text-foreground rounded-bl-md"
      )}>

        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />
          }}
        >
          {message}
        </ReactMarkdown>

        <p className={cn(
          "text-xs mt-2 opacity-70 text-right w-full",
          isUser ? "text-white/80" : "text-muted-foreground"
        )}>
          {timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};