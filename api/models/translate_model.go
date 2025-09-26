package models

type Translated struct {
	Formal   string
	Informal string
	Street   string
	Internet string
	Any      string
}

var AcceptedModels = []string{"informal", "formal", "street", "internet", "any"}
