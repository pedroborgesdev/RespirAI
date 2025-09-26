package routes

import (
	"respirai/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	chatController := controllers.NewChatController()

	router.POST("/chat", chatController.Chat)
}
