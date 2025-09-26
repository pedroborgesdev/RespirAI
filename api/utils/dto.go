package utils

type ChatRequest struct {
	MensagemUsuario string `json:"mensagem_usuario" binding:"required"`
}
