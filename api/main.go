package main

import (
	"respirai/config"
	"respirai/debug"
	"respirai/logger"
	"respirai/middlewares"
	"respirai/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	debug.LoadDebugConfig()

	logger.Log("INFO", "Application has been started", []logger.LogDetail{}, false)

	config.LoadAppConfig()

	// database.InitDB()

	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.Use(
		middlewares.CORSMiddleware(),
	)

	routes.SetupRoutes(router)

	router.Run(":" + config.AppConfig.HTTP_PORT)
}
