export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ApiRequest {
  mensagem_usuario: string;
}

export interface ApiResponse {
  code: string;
  message: string;
  data: {
    resposta_ia: string;
  };
}