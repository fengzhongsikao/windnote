package zhanbu

import (
	"fmt"
	"io"
	"net/http"
	"time"
)

func (a *App) FetchLunarData() (string, error) {
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get("https://uapis.cn/api/v1/misc/lunartime")
	if err != nil {
		return "", fmt.Errorf("failed to fetch lunar data: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	return string(body), nil
}
