package controllers

import (
	"respirai/logger"
	"respirai/services"
	"respirai/utils"

	"github.com/gin-gonic/gin"
)

type ChatController struct {
	chatService *services.ChatService
}

func NewChatController() *ChatController {
	return &ChatController{
		chatService: services.NewChatService(),
	}
}

func (c *ChatController) Chat(ctx *gin.Context) {
	var req *utils.ChatRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(ctx, gin.H{"error": err.Error()})
		return
	}

	result, err := c.chatService.Chat(req)
	if err != nil {
		utils.InternalError(ctx, gin.H{"error": err.Error()})
		logger.Log("ERROR", "failed to search", []logger.LogDetail{
			{Key: "reason", Value: err.Error()},
		}, true)
		return
	}

	utils.Success(ctx, gin.H{
		"resposta_ia": result,
	})
}
