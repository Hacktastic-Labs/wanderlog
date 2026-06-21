package places

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v5"
)

var (
	errGooglePlacesNotConfigured = errors.New("google places is not configured")
	ErrPlaceNotFound             = errors.New("place not found")
)

type InvalidRequestError struct {
	Message string
}

func (e *InvalidRequestError) Error() string {
	return e.Message
}

func googleAPIError(status, message string) error {
	msg := message
	if msg == "" {
		msg = status
	}

	switch status {
	case "INVALID_REQUEST":
		return &InvalidRequestError{Message: msg}
	case "NOT_FOUND", "ZERO_RESULTS":
		return ErrPlaceNotFound
	case "OVER_QUERY_LIMIT", "REQUEST_DENIED", "UNKNOWN_ERROR":
		return fmt.Errorf("google places upstream error: %s", msg)
	default:
		if status != "OK" {
			return fmt.Errorf("google places error: %s", msg)
		}
	}

	return nil
}

func placesHTTPError(c *echo.Context, err error) error {
	if err == nil {
		return nil
	}

	var invalidRequest *InvalidRequestError
	switch {
	case errors.Is(err, errGooglePlacesNotConfigured):
		return echo.NewHTTPError(http.StatusServiceUnavailable, "Places search is not available")
	case errors.Is(err, ErrPlaceNotFound):
		return echo.NewHTTPError(http.StatusNotFound, "Place not found")
	case errors.As(err, &invalidRequest):
		return echo.NewHTTPError(http.StatusBadRequest, invalidRequest.Message)
	default:
		c.Logger().Error("places request failed", "error", err)
		return echo.NewHTTPError(http.StatusBadGateway, "Failed to fetch place data")
	}
}
