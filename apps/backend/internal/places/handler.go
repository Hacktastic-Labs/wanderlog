package places

import (
	"net/http"

	"github.com/labstack/echo/v5"
)

type PlacesHandler struct {
	placesService *PlacesService
}

func NewPlacesHandler(service *PlacesService) *PlacesHandler {
	return &PlacesHandler{placesService: service}
}

func (h *PlacesHandler) RegisterRoutes(e *echo.Echo) {
	router := e.Group("/places")
	router.GET("/photo", h.getPhoto)
	router.GET("/search/nearby", h.searchNearby)
	router.GET("/search/text", h.searchText)
	router.GET("/:placeId/details", h.getPlaceDetails)
	router.POST("/add", h.addPlace)
}

func (h *PlacesHandler) searchNearby(c *echo.Context) error {
	request := new(SearchNearbyRequest)
	if err := bindAndValidate(c, request); err != nil {
		return err
	}

	result, err := h.placesService.SearchNearby(NearbySearchParams{
		Latitude:  request.Lat,
		Longitude: request.Lng,
		Radius:    request.Radius,
		PlaceType: request.Type,
		Keyword:   request.Keyword,
		PageToken: request.PageToken,
	})
	if err != nil {
		return placesHTTPError(c, err)
	}

	return c.JSON(http.StatusOK, result)
}

func (h *PlacesHandler) searchText(c *echo.Context) error {
	request := new(SearchTextRequest)
	if err := bindAndValidate(c, request); err != nil {
		return err
	}

	result, err := h.placesService.SearchText(TextSearchParams{
		Query:     request.Query,
		PlaceType: request.Type,
		Keyword:   request.Keyword,
		PageToken: request.PageToken,
	})
	if err != nil {
		return placesHTTPError(c, err)
	}

	return c.JSON(http.StatusOK, result)
}

func (h *PlacesHandler) getPlaceDetails(c *echo.Context) error {
	placeID := c.Param("placeId")
	if placeID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "placeId is required")
	}

	result, err := h.placesService.GetPlaceDetails(placeID)
	if err != nil {
		return placesHTTPError(c, err)
	}

	return c.Blob(http.StatusOK, "application/json", result)
}

func (h *PlacesHandler) getPhoto(c *echo.Context) error {
	request := new(GetPhotoRequest)
	if err := bindAndValidate(c, request); err != nil {
		return err
	}

	contentType, data, err := h.placesService.FetchPhoto(request.PhotoReference, request.MaxWidth)
	if err != nil {
		return placesHTTPError(c, err)
	}

	return c.Blob(http.StatusOK, contentType, data)
}

func (h *PlacesHandler) addPlace(c *echo.Context) error {
	request := &AddPlaceRequest{
		SourceType: "USER",
	}
	if err := c.Bind(request); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}
	if err := requestValidator.Struct(request); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, formatValidationError(err))
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

	if err := h.placesService.AddPlace(payload); err != nil {
		c.Logger().Error("failed to add place", "error", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to add place")
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Place added successfully"})
}
