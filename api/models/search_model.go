package models

import (
	"encoding/json"
)

type PlaceResult struct {
	Name      string  `json:"name"`
	Address   string  `json:"address"`
	Phone     string  `json:"phone,omitempty"`
	Email     string  `json:"email,omitempty"`
	Website   string  `json:"website,omitempty"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type PlacesResponse struct {
	Results []PlaceResult `json:"results"`
	Status  string        `json:"status"`
}

// Função para converter a resposta crua do Geoapify
func ParseGeoapifyResponse(data []byte) (*PlacesResponse, error) {
	// Struct auxiliar só para parsear o JSON do Geoapify
	var raw struct {
		Features []struct {
			Properties struct {
				Name        string `json:"name"`
				AddressLine string `json:"address_line1"`
				Contact     struct {
					Phone   string `json:"phone,omitempty"`
					Email   string `json:"email,omitempty"`
					Website string `json:"website,omitempty"`
				} `json:"contact,omitempty"`
				Lat float64 `json:"lat"`
				Lon float64 `json:"lon"`
			} `json:"properties"`
		} `json:"features"`
	}

	if err := json.Unmarshal(data, &raw); err != nil {
		return nil, err
	}

	// Converter para o seu modelo
	results := []PlaceResult{}
	for _, f := range raw.Features {
		results = append(results, PlaceResult{
			Name:      f.Properties.Name,
			Address:   f.Properties.AddressLine,
			Phone:     f.Properties.Contact.Phone,
			Email:     f.Properties.Contact.Email,
			Website:   f.Properties.Contact.Website,
			Latitude:  f.Properties.Lat,
			Longitude: f.Properties.Lon,
		})
	}

	return &PlacesResponse{
		Results: results,
		Status:  "OK",
	}, nil
}
