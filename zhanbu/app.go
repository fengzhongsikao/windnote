package zhanbu

import (
	"context"
	"fmt"
)

type App struct {
	ctx context.Context
}

func New() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetAppVersion() string {
	return "1.0.0"
}
