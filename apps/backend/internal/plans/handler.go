package plans

import (
	"net/http"
	"time"

	"github.com/Hacktastic-Labs/wanderlog/internal/auth"
	"github.com/labstack/echo/v5"
)

type PlanHandler struct {
	planService *PlanService
}

type CreatePlanRequest struct {
	Title         string  `json:"title"`
	Description   string  `json:"description"`
	Visibility    string  `json:"visibility"`
	Status        string  `json:"status"`
	StartDate     string  `json:"start_date"`
	EndDate       string  `json:"end_date"`
	EstimatedCost float64 `json:"estimated_cost"`
}

func NewPlanHandler(p *PlanService) *PlanHandler {
	return &PlanHandler{planService: p}
}

func (h *PlanHandler) RegisterRoutes(e *echo.Echo) {
	router := e.Group("/plans")
	router.POST("/create", h.CreatePlan)
}

func (h *PlanHandler) CreatePlan(c *echo.Context) error {
	request := new(CreatePlanRequest)
	if err := c.Bind(request); err != nil {
		c.Logger().Error("invalid request body", "error", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	startDate, err := time.Parse(time.DateOnly, request.StartDate)
	if err != nil {
		c.Logger().Error("invalid start date", "start_date", request.StartDate, "error", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid start date")
	}
	endDate, err := time.Parse(time.DateOnly, request.EndDate)
	if err != nil {
		c.Logger().Error("invalid end date", "end_date", request.EndDate, "error", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid end date")
	}

	user, ok := c.Get(string(auth.ContextUserKey)).(*auth.ContextUser)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "user not found")
	}

	payload := &Plan{
		Title:         request.Title,
		Description:   &request.Description,
		Visibility:    request.Visibility,
		Status:        request.Status,
		StartDate:     &startDate,
		EndDate:       &endDate,
		EstimatedCost: &request.EstimatedCost,
		CreatedBy:     user.UserId,
	}

	err = h.planService.CreatePlan(c.Request().Context(), payload)
	if err != nil {
		c.Logger().Error("failed to create plan", "title", request.Title, "error", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create plan")
	}

	return c.JSON(http.StatusOK, "Plan created successfully")
}
