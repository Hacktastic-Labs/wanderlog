package plans

import (
	"context"
	"fmt"

	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreatePlan(ctx context.Context, plan *Plan) error {
	_, err := r.db.NewInsert().Model(plan).Returning("*").Exec(context.Background())
	if err != nil {
		return fmt.Errorf("create plan: %w", err)
	}
	return nil
}

func (r *Repository) ListPlansForUser(ctx context.Context, userId int64) ([]Plan, error) {
	plans := []Plan{}
	err := r.db.NewSelect().Model(&plans).Where("created_by = ?", userId).Scan(context.Background())
	if err != nil {
		return nil, fmt.Errorf("list plans for user %d: %w", userId, err)
	}
	return plans, err
}

func (r *Repository) CreatePlanInvitation(ctx context.Context, payload *PlanInvitation) error {
	_, err := r.db.NewInsert().Model(payload).Returning("*").Exec(ctx)
	if err != nil {
		return fmt.Errorf("create plan invitation: %w", err)
	}
	return nil
}
func (r *Repository) UpdatePlanInvitation(ctx context.Context, payload *PlanInvitation) error {
	_, err := r.db.NewUpdate().Model(payload).Where("id = ?", payload.ID).Exec(ctx)
	if err != nil {
		return fmt.Errorf("update plan invitation %d: %w", payload.ID, err)
	}
	return nil
}

func (r *Repository) GetPlanInvitationByID(ctx context.Context, id int64) (*PlanInvitation, error) {
	planInvitation := &PlanInvitation{}
	err := r.db.NewSelect().Model(planInvitation).Where("id = ?", id).Scan(ctx)
	if err != nil {
		return nil, fmt.Errorf("get plan invitation %d: %w", id, err)
	}
	return planInvitation, nil
}

func (r *Repository) CreateExpense(ctx context.Context, payload *Expense) error {
	_, err := r.db.NewInsert().Model(payload).Returning("*").Exec(ctx)
	if err != nil {
		return fmt.Errorf("create expense: %w", err)
	}
	return nil
}

func (r *Repository) AddExpenseParticipant(ctx context.Context, payload *ExpenseParticipant) error {
	_, err := r.db.NewInsert().Model(payload).Returning("*").Exec(ctx)
	if err != nil {
		return fmt.Errorf("add expense participant: %w", err)
	}
	return nil
}

func (r *Repository) GetExpensesByPlan(ctx context.Context, planID int64) ([]Expense, error) {
	PlanExpenses := []Expense{}
	err := r.db.NewSelect().Model(&PlanExpenses).Where("plan_id = ?", planID).Scan(ctx)
	if err != nil {
		return nil, fmt.Errorf("get expenses for plan %d: %w", planID, err)
	}
	return PlanExpenses, nil
}

func (r *Repository) GetTotalExpenseAmount(ctx context.Context, planID int64) (float64, error) {
	var total float64
	err := r.db.NewSelect().Column("SUM(amount)").Table("expenses").Where("plan_id = ?", planID).Scan(ctx, &total)
	if err != nil {
		return 0, fmt.Errorf("get total expense amount for plan %d: %w", planID, err)
	}
	return total, nil
}

// func (r *Repository) GetFinalExpenseByParticipants(ctx context.Context, planID int64) (float64, error) {
// 	FinalExpense := []ExpenseParticipant{}
// 	err := r.db.NewSelect().Model(&FinalExpense).Where("plan_id = ?", planID).Scan(ctx)
// 	if err != nil {
// 		return 0, err
// 	}
// 	return FinalExpense, nil
// }
