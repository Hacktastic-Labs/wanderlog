package auth

import (
	"net/http"

	"github.com/labstack/echo/v5"
)

type AuthHandler struct {
	authService *AuthService
}

func (h *AuthHandler) RegisterRoutes(e *echo.Echo) {
	router := e.Group("/auth")
	router.POST("/signup", h.SignUpPassHandler)
	router.POST("/signin", h.SignInPassHandler)
}

func NewAuthHandler(authService *AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) SignUpPassHandler(c *echo.Context) error {
	req := new(UserSignUpRequest)
	if err := c.Bind(req); err != nil {
		c.Logger().Error("Invalid request body", "error", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	res, err := h.authService.SignUpWithEmailAndPassword(*req)
	if err != nil {
		c.Logger().Error("Failed to sign up", "error", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to sign up")
	}
	return c.JSON(http.StatusOK, res)
}

func (h *AuthHandler) SignInPassHandler(c *echo.Context) error {
	req := new(UserSignInRequest)
	if err := c.Bind(req); err != nil {
		c.Logger().Error("Invalid request body", "error", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	res, err := h.authService.SignInWithEmailAndPassword(req.Email, req.Password)
	if err != nil {
		c.Logger().Error("Unable to sign in", "error", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to sign in")
	}
	return c.JSON(http.StatusOK, res)
}
