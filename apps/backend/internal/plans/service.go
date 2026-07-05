package plans

import (
	"context"
)

type PlanRepository interface {
	// Plans
	CreatePlan(ctx context.Context, plan *Plan) error
	UpdatePlan(ctx context.Context, plan *Plan) error
	GetPlanByID(ctx context.Context, planID int64) (*Plan, error)
	ListPlansForUser(ctx context.Context, userID int64) ([]Plan, error)

	// Members
	AddPlanMember(ctx context.Context, member *PlanMember) error
	GetPlanMembers(ctx context.Context, planID int64) ([]PlanMember, error)

	// Invitations
	CreatePlanInvitation(ctx context.Context, inv *PlanInvitation) error
	UpdatePlanInvitation(ctx context.Context, inv *PlanInvitation) error

	// Items
	AddPlanItem(ctx context.Context, item *PlanItem) error
	UpdatePlanItem(ctx context.Context, item *PlanItem) error
	DeletePlanItem(ctx context.Context, itemID int64) error
	GetPlanItems(ctx context.Context, planID int64) ([]PlanItem, error)
	AddPlanItemParticipant(ctx context.Context, p *PlanItemParticipant) error

	// Expenses
	CreateExpense(ctx context.Context, expense *Expense) error
	AddExpenseParticipant(ctx context.Context, p *ExpenseParticipant) error
	GetExpensesByPlan(ctx context.Context, planID int64) ([]Expense, error)
	GetTotalExpenseAmount(ctx context.Context, planID int64) (float64, error)
	GetFinalExpenseByParticipants(ctx context.Context, planID int64) (float64, error)
}

type PlanService struct {
	planRepository PlanRepository
}

func NewPlanService(planRepository PlanRepository) *PlanService {
	return &PlanService{planRepository: planRepository}
}

func (s *PlanService) CreatePlan(ctx context.Context, plan *Plan) error {
	return s.planRepository.CreatePlan(ctx, plan)
}
