package places

import (
	"net/http"

	"github.com/labstack/echo/v5"
)

type PlacesHandler struct {
	placesService *PlacesService
}

type AddPlaceRequest struct {
	Name        string
	Description string
	Address     string
	City        string
	State       string
	Country     string
	SourceType  string
}

func NewPlacesHandler(service *PlacesService) *PlacesHandler {
	return &PlacesHandler{placesService: service}
}

func (h *PlacesHandler) RegisterRoutes(e *echo.Echo) {
	router := e.Group("/places")
	router.POST("/add", h.addPlace)
}

func (h *PlacesHandler) addPlace(e *echo.Context) error {
	request := &AddPlaceRequest{
		SourceType: "USER",
	}
	if err := e.Bind(request); err != nil {
		return e.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	payload := &Place{
		Name:        request.Name,
		Description: &request.Description,
		Address:     &request.Address,
		City:        &request.City,
		Country:     &request.Country,
		State:       &request.State,
		SourceType:  request.SourceType,
	}

	h.placesService.AddPlace(payload)

	return e.JSON(http.StatusOK, map[string]string{"message": "Place added successfully"})
}
