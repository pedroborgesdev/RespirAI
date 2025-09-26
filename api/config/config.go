package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"

	"respirai/logger"
)

type Config struct {
	HTTP_PORT        string
	CLIENT_KEY       string
	CLIENT_GENAI_KEY string
}

var AppConfig Config

func LoadAppConfig() error {

	err := godotenv.Load()
	if err != nil {
		logger.Log("DEBUG", "error on read .env file", []logger.LogDetail{
			{Key: "Error", Value: err.Error()},
		}, false)
	}

	AppConfig = Config{
		HTTP_PORT:        getEnvStr("HTTP_PORT", "8080"),
		CLIENT_KEY:       getEnvStr("CLIENT_KEY", ""),
		CLIENT_GENAI_KEY: getEnvStr("CLIENT_GENAI_KEY", ""),
	}

	return nil
}

func getEnvStr(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvBool(key string, defaultValue bool) bool {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	boolValue, err := strconv.ParseBool(value)
	if err != nil {
		return defaultValue
	}
	return boolValue
}

func getEnvInt(key string, defaultValue int) int {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	intValue, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}
	return intValue
}
