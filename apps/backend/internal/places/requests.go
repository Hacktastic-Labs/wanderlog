package places

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v5"
)

var requestValidator = validator.New()

type AddPlaceRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
	Address     string `json:"address"`
	City        string `json:"city"`
	State       string `json:"state"`
	Country     string `json:"country"`
	SourceType  string `json:"source_type" validate:"omitempty,oneof=USER GOOGLE"`
}

type SearchNearbyRequest struct {
	Lat       float64 `query:"lat" validate:"required"`
	Lng       float64 `query:"lng" validate:"required"`
	Radius    int     `query:"radius" validate:"omitempty,gte=1"`
	Type      string  `query:"type"`
	Keyword   string  `query:"keyword"`
	PageToken string  `query:"pagetoken"`
}

type SearchTextRequest struct {
	Query     string `query:"query" validate:"required"`
	Type      string `query:"type"`
	Keyword   string `query:"keyword"`
	PageToken string `query:"pagetoken"`
}

type GetPhotoRequest struct {
	PhotoReference string `query:"photo_reference" validate:"required"`
	MaxWidth       string `query:"maxwidth" validate:"omitempty,numeric,min=1,max=1600"`
}

func bindAndValidate(c *echo.Context, dest any) error {
	if err := c.Bind(dest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request parameters")
	}

	if err := requestValidator.Struct(dest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, formatValidationError(err))
	}

	return nil
}

func formatValidationError(err error) string {
	validationErrors, ok := err.(validator.ValidationErrors)
	if !ok {
		return "Invalid request parameters"
	}

	messages := make([]string, 0, len(validationErrors))
	for _, fieldErr := range validationErrors {
		switch fieldErr.Tag() {
		case "required":
			messages = append(messages, fmt.Sprintf("%s is required", jsonFieldName(fieldErr)))
		case "gte":
			messages = append(messages, fmt.Sprintf("%s must be greater than or equal to %s", jsonFieldName(fieldErr), fieldErr.Param()))
		case "numeric":
			messages = append(messages, fmt.Sprintf("%s must be a number", jsonFieldName(fieldErr)))
		case "oneof":
			messages = append(messages, fmt.Sprintf("%s must be one of: %s", jsonFieldName(fieldErr), fieldErr.Param()))
		default:
			messages = append(messages, fmt.Sprintf("%s is invalid", jsonFieldName(fieldErr)))
		}
	}

	return strings.Join(messages, "; ")
}

func jsonFieldName(fieldErr validator.FieldError) string {
	field := strings.ToLower(fieldErr.Field())
	switch field {
	case "lat":
		return "lat"
	case "lng":
		return "lng"
	case "pagetoken":
		return "pagetoken"
	case "photoreference":
		return "photo_reference"
	case "maxwidth":
		return "maxwidth"
	case "sourcetype":
		return "source_type"
	default:
		return field
	}
}
