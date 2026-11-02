package zhanbu

import (
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v3/pkg/application"
)

func (a *App) SaveScreenshot(filename string, data string) (string, error) {
	if idx := strings.Index(data, ","); idx != -1 {
		data = data[idx+1:]
	}

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return "", fmt.Errorf("failed to decode base64: %w", err)
	}

	savePath, err := application.Get().Dialog.SaveFileWithOptions(&application.SaveFileDialogOptions{
		Filename: filename,
		Filters: []application.FileFilter{
			{DisplayName: "PNG Images (*.png)", Pattern: "*.png"},
			{DisplayName: "JPEG Images (*.jpg)", Pattern: "*.jpg;*.jpeg"},
		},
	}).PromptForSingleSelection()
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

func (a *App) GetDefaultSavePath() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return ""
	}
	return filepath.Join(home, "Downloads")
}
