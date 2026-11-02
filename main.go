package main

import (
	"embed"
	"log"
	"time"

	"changeme/zhanbu"
	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func init() {
	application.RegisterEvent[string]("time")
}
func main() {
	app := application.New(application.Options{
		Name:        "windnote",
		Description: "一个起卦工具",
		Services: []application.Service{
			application.NewService(zhanbu.New()),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})
	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "风筮",
		// Window sized to the golden ratio (1000 / 618 ≈ 1.618).
		Width:  1222,
		Height: 768,
		Mac: application.MacWindow{
			TitleBar: application.MacTitleBarDefault,
		},
		BackgroundColour: application.NewRGB(6, 7, 15),
		URL:              "/",
	})
	go func() {
		for {
			now := time.Now().Format(time.RFC1123)
			app.Event.Emit("time", now)
			time.Sleep(time.Second)
		}
	}()
	err := app.Run()
	if err != nil {
		log.Fatal(err)
	}
}
