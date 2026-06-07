package database

import (
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

func Connect(dbURL string, logger *slog.Logger) *bun.DB {
    sqldb := sql.OpenDB(pgdriver.NewConnector(
        pgdriver.WithDSN(dbURL),
    ))
    db := bun.NewDB(sqldb, pgdialect.New())

    err := sqldb.Ping(); 
    if err != nil {
        panic(fmt.Errorf("failed to connect to database: %w", err))
    }
    logger.Info("connected to database", "dbURL", dbURL)

    return db
}
