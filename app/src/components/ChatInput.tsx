import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 pb-14 bg-card border-t border-border">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Descreva seus sintomas aqui... (Ex: sinto dor de cabeça e náusea)"
          className={cn(
            "min-h-[60px] max-h-[120px] resize-none border-input",
            "focus:ring-2 focus:ring-health-primary focus:border-transparent",
            "placeholder:text-muted-foreground"
          )}
          disabled={disabled || isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        className={cn(
          "h-[60px] px-6 bg-health-primary hover:bg-health-secondary",
          "shadow-button transition-smooth",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
};