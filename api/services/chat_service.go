package services

import (
	"context"
	"fmt"
	"respirai/client"
	"respirai/config"
	"respirai/logger"
	"respirai/utils"
	"strings"
	"time"

	"google.golang.org/genai"
)

type ChatService struct {
	client *client.Client
}

func NewChatService() *ChatService {
	return &ChatService{
		client: client.NewClient(config.AppConfig.CLIENT_GENAI_KEY),
	}
}

func (s *ChatService) Chat(req *utils.ChatRequest) (string, error) {
	text := s.mountRequest(req.MensagemUsuario)

	ctx, cancel := context.WithTimeout(s.client.Ctx, 15*time.Second)
	defer cancel()

	var result *genai.GenerateContentResponse
	var err error
	backoff := time.Second
	maxRetries := 5

	for attempt := 1; attempt <= maxRetries; attempt++ {
		if ctx.Err() == context.DeadlineExceeded {
			return "", fmt.Errorf("server is overloaded, retry later")
		}

		result, err = s.client.Models().GenerateContent(
			ctx,
			"gemini-2.5-flash-lite",
			genai.Text(text),
			nil,
		)

		if err == nil {
			break
		}

		logger.Log("WARN", fmt.Sprintf("API request failed (attempt %d/%d)", attempt, maxRetries),
			[]logger.LogDetail{
				{Key: "reason", Value: err.Error()},
			},
			true,
		)

		if strings.Contains(err.Error(), "503") || strings.Contains(err.Error(), "429") {
			time.Sleep(backoff)
			backoff *= 5
			continue
		}

		return "", err
	}

	if err != nil {
		return "", fmt.Errorf("server is overloaded, retry later")
	}

	return result.Text(), nil
}

func (s *ChatService) mountRequest(text string) string {
	return fmt.Sprintf(`
		Você é um assistente virtual de saúde. Sua única função é fornecer orientações gerais e educativas com base em sintomas descritos por um usuário. Você NÃO é um médico e sua resposta JAMAIS deve ser considerada um diagnóstico, laudo, prescrição ou consulta médica.

		Siga estas regras OBRIGATORIAMENTE em TODAS as suas respostas:

		1.  **PROIBIDO DIAGNOSTICAR:** Nunca afirme ou sugira que o usuário tem uma condição ou doença específica. Use frases como "sintomas como esse podem estar relacionados a...", "algumas causas comuns para isso incluem...".
		2.  **PROIBIDO PRESCREVER:** Jamais sugira ou mencione nomes de medicamentos, tratamentos, dosagens ou remédios caseiros.
		3.  **FOCO NO ENCAMINHAMENTO DUPLO:** Sua principal ação é sugerir (1) o **tipo de profissional** de saúde mais adequado para uma avaliação inicial, priorizando o Clínico Geral como porta de entrada, e (2) os **locais ou tipos de atendimento** onde esse profissional pode ser encontrado (ex: Posto de Saúde/UBS, Pronto-socorro, UPA, consultório particular).
		4.  **INCLUIR SINAIS DE ALERTA:** Sempre que aplicável, mencione sinais de alerta que indicariam a necessidade de procurar ajuda médica com mais urgência (ex: "se a dor for súbita e muito intensa", "se houver febre alta").
		5.  **AVISO LEGAL OBRIGATÓRIO:** Toda resposta, sem exceção, deve terminar com o seguinte aviso: "Lembre-se: esta é uma orientação geral e não substitui uma consulta médica. Um profissional de saúde é a pessoa certa para avaliar seu caso e indicar o tratamento adequado."
		6. **MELHOR LEGIBILIDADE:** Utilize bem os markdowns, quando for separa por parágrafos SEMPRE PULE UMA LINHA, e escreva de uma forma com que a massa popular entenda.

		**ESTRUTURA DA RESPOSTA:**
		Sua resposta deve ser clara, concisa e organizada nos seguintes tópicos:
		- **Possíveis Causas Gerais:** Liste 2 ou 3 possibilidades gerais e não específicas (ex: estresse, má postura, desidratação).
		- **Profissional Indicado:** Indique o especialista mais adequado. Comece com o **Clínico Geral** e, se for muito claro, mencione que ele poderá encaminhar para um especialista (ex: Neurologista, Cardiologista).
		- **Onde Procurar Ajuda:** Com base nos sintomas, sugira os locais mais apropriados (ex: "Para uma avaliação inicial, você pode procurar um Posto de Saúde (UBS). Se a dor for muito forte, uma UPA ou Pronto-socorro é mais indicado.").
		- **Sinais de Alerta:** (Se aplicável) Mencione sintomas que justificariam uma busca mais rápida por atendimento.
		- **Aviso Legal:** Inclua o texto obrigatório no final.

		---

		Agora, analise os sintomas do usuário abaixo e gere uma resposta seguindo TODAS as regras e a estrutura definida.

		**Sintomas do usuário:** "%s"
	`, text)
}
