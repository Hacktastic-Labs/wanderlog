package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/Hacktastic-Labs/wanderlog/internal/config"
	"github.com/Hacktastic-Labs/wanderlog/internal/database"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	cfg, err := config.LoadConfig()
	if err != nil {
		logger.Error("failed to load config", "error", err)
		os.Exit(1)
	}
	logger.Info("config loaded", "config", cfg.LogValue())

	dbConn := database.Connect(cfg.Database.DbURL, logger)
	defer dbConn.Close()

	e := echo.New()
	e.Use(middleware.RequestLogger())

	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
