package auth

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v5"
)

func (s *AuthService) RequireAuth() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			path := c.Request().URL.Path
			if strings.HasPrefix(path, "/auth/") {
				return next(c)
			}

			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return echo.NewHTTPError(http.StatusUnauthorized, "missing authorization header")
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid authorization header format")
			}

			token := parts[1]
			user, err := s.GetUserFromToken(token)
			if err != nil {
				c.Logger().Error("failed to authenticate user", "error", err)
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid or expired token")
			}

			c.Set(string(ContextUserKey), user)
			return next(c)
		}
	}
}
