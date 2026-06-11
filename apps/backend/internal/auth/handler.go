package auth

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v5"
)

type AuthHandler struct {
	authService *AuthService
}

func NewAuthHandler(authService *AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) SignUpPassHandler(c *echo.Context) error {
	req := new(UserSignUpRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	res, err := h.authService.SignUpWithEmailAndPassword(*req)
	if err != nil {
		fmt.Println("Failed to sign up", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to sign up",
		})
	}
	return c.JSON(http.StatusOK, res)
}
