package main

import (
	"context"
	"fmt"
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

// GetAppVersion returns the application version
func (a *App) GetAppVersion() string {
	return "1.0.0"
}

// SaveScreenshot saves a base64 encoded image to the user's downloads folder
func (a *App) SaveScreenshot(filename string, data string) (string, error) {
	// Remove base64 prefix if present
	if idx := strings.Index(data, ","); idx != -1 {
		data = data[idx+1:]
	}

	// For simplicity, we'll let frontend handle base64 and just save the blob
	// Actually, let's use runtime.SaveFileDialog for better UX

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

	// Write file
	err = os.WriteFile(savePath, []byte(data), 0644)
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

// GetTodayAlmanac returns today's almanac info
func (a *App) GetTodayAlmanac() map[string]string {
	now := time.Now()
	weekday := []string{"日", "一", "二", "三", "四", "五", "六"}[now.Weekday()]

	return map[string]string{
		"date":     fmt.Sprintf("%d年%d月%d日", now.Year(), now.Month(), now.Day()),
		"weekday":  weekday,
		"yi":       "祭祀 祈福 求嗣",
		"ji":       "动土 嫁娶 出行",
		"caishen":  "东南",
		"xishen":   "正南",
		"fushen":   "正东",
		"yanggui":  "东北",
	}
}

// GetLocation returns the default location
func (a *App) GetLocation() string {
	return "广东中山"
}
