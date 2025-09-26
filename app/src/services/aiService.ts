import { ApiRequest, ApiResponse } from "@/types/chat";

const AI_API_URL = 'https://bellchi.com/chat';

/**
 * Envia a mensagem do usuário para a API de IA real e retorna a resposta.
 * @param userMessage A mensagem/sintoma digitado pelo usuário.
 * @returns A resposta processada pela IA.
 */
export const sendSymptomMessage = async (userMessage: string): Promise<string> => {
  try {
    const requestData: ApiRequest = {
      mensagem_usuario: userMessage
    };

    console.log('Enviando para a API:', JSON.stringify(requestData));

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      // Captura mais detalhes do erro, se a API enviar
      const errorBody = await response.text();
      console.error('Erro da API:', response.status, response.statusText, errorBody);
      throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    
    console.log(response.json())
    if (!data.data || !data.data.resposta_ia) {
          throw new Error('Resposta da API não contém o campo esperado "data.resposta_ia"');
        }

    return data.data.resposta_ia;
  } catch (error) {
    console.error('Erro ao se comunicar com a IA:', error);
    
    // Resposta de fallback em caso de erro na comunicação
    return `Desculpe, não foi possível processar sua mensagem no momento. Por favor, tente novamente mais tarde ou consulte diretamente um profissional de saúde se os sintomas persistirem.
    
Em caso de emergência, procure atendimento médico imediatamente ou ligue para 192 (SAMU).`;
  }
};

/**
 * Simulação de resposta para desenvolvimento/testes.
 * Manter esta função pode ser útil para testar a UI sem fazer chamadas reais à API.
 */
export const mockAiResponse = async (userMessage: string): Promise<string> => {
    // ... (código da função mock inalterado)
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (userMessage.toLowerCase().includes('dor de cabeça')) {
        return `(MOCK) Resposta para dor de cabeça...`;
    }
    return `(MOCK) Resposta genérica...`;
};