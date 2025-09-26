package client

import (
	"context"
	"respirai/logger"

	"google.golang.org/genai"
)

type Client struct {
	client *genai.Client
	Ctx    context.Context
}

func NewClient(apiKey string) *Client {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		logger.Log("FATAL", "cannot init api client", []logger.LogDetail{
			{Key: "reason", Value: err.Error()},
		}, false)
	}

	logger.Log("SUCCESS", "client has been initialized", []logger.LogDetail{}, false)

	return &Client{
		client: client,
		Ctx:    ctx,
	}
}

func (g *Client) Models() *genai.Models {
	return g.client.Models
}

func (g *Client) Close() {
	if g.client != nil {
		g.client.ClientConfig().HTTPClient.CloseIdleConnections()
	}
}
