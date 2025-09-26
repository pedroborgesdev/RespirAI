package utils

func ContainsInArray(item string, slice []string) bool {
	for _, v := range slice {
		if v == item {
			return true
		}
	}
	return false
}
