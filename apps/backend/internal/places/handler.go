package places

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v5"
)

type PlacesHandler struct {
	placesService *PlacesService
}

type AddPlaceRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Address     string `json:"address"`
	City        string `json:"city"`
	State       string `json:"state"`
	Country     string `json:"country"`
	SourceType  string `json:"source_type"`
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
	latitude, err := strconv.ParseFloat(c.QueryParam("lat"), 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "lat is required and must be a number")
	}

	longitude, err := strconv.ParseFloat(c.QueryParam("lng"), 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "lng is required and must be a number")
	}

	radius := defaultSearchRadius
	if value := c.QueryParam("radius"); value != "" {
		parsedRadius, err := strconv.Atoi(value)
		if err != nil || parsedRadius <= 0 {
			return echo.NewHTTPError(http.StatusBadRequest, "radius must be a positive integer")
		}
		radius = parsedRadius
	}

	result, err := h.placesService.SearchNearby(
		latitude,
		longitude,
		radius,
		c.QueryParam("type"),
		c.QueryParam("keyword"),
		c.QueryParam("pagetoken"),
	)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, err.Error())
	}

	return c.JSON(http.StatusOK, result)
}

func (h *PlacesHandler) searchText(c *echo.Context) error {
	query := c.QueryParam("query")
	if query == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "query is required")
	}

	result, err := h.placesService.SearchText(
		query,
		c.QueryParam("type"),
		c.QueryParam("keyword"),
		c.QueryParam("pagetoken"),
	)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, err.Error())
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
		return echo.NewHTTPError(http.StatusBadGateway, err.Error())
	}

	return c.Blob(http.StatusOK, "application/json", result)
}

func (h *PlacesHandler) getPhoto(c *echo.Context) error {
	reference := c.QueryParam("reference")
	if reference == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "reference is required")
	}

	contentType, data, err := h.placesService.FetchPhoto(reference, c.QueryParam("maxwidth"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, err.Error())
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
