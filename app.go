package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// FetchLunarData proxies the lunar calendar API request from the frontend
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

// GetAppVersion returns the application version
func (a *App) GetAppVersion() string {
	return "1.0.0"
}

// SaveScreenshot saves a base64 encoded image to a user-selected file path
func (a *App) SaveScreenshot(filename string, data string) (string, error) {
	// Remove base64 prefix if present
	if idx := strings.Index(data, ","); idx != -1 {
		data = data[idx+1:]
	}

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return "", fmt.Errorf("failed to decode base64: %w", err)
	}

	savePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename: filename,
		Filters: []runtime.FileFilter{
			{DisplayName: "PNG Images (*.png)", Pattern: "*.png"},
			{DisplayName: "JPEG Images (*.jpg)", Pattern: "*.jpg;*.jpeg"},
		},
	})
	if err != nil {
		return "", err
	}
	if savePath == "" {
		return "", fmt.Errorf("user cancelled")
	}

	err = os.WriteFile(savePath, decoded, 0644)
	if err != nil {
		return "", err
	}

	return savePath, nil
}

// GetDefaultSavePath returns the default path for saving screenshots
func (a *App) GetDefaultSavePath() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return ""
	}
	return filepath.Join(home, "Downloads")
}
