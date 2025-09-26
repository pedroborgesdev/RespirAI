import { cn } from "@/lib/utils";

export const TypingIndicator = () => {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className={cn(
        "max-w-[80%] px-4 py-3 rounded-2xl shadow-chat transition-smooth",
        "bg-chat-ai text-foreground rounded-bl-md"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">RespirAI está analisando</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};