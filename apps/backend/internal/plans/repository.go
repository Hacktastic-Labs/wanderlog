package plans

import (
	"context"

	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreatePlan(plan *Plan) error {
	_, err := r.db.NewInsert().Model(plan).Returning("*").Exec(context.Background())
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) ListPlansForUser(userId int64) ([]Plan, error) {
	plans := []Plan{}
	err := r.db.NewSelect().Model(&plans).Where("created_by = ?", userId).Scan(context.Background())
	if err != nil {
		return nil, err
	}
	return plans, err
}

func (r *Repository) CreatePlanInvitation(ctx context.Context, payload *PlanInvitation) error {
	_, err := r.db.NewInsert().Model(payload).Returning("*").Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}
func (r *Repository) UpdatePlanInvitation(ctx context.Context, payload *PlanInvitation) error {
	_, err := r.db.NewUpdate().Model(payload).Where("id = ?", payload.ID).Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) GetPlanInvitationByID(ctx context.Context, id int64) (*PlanInvitation, error) {
	planInvitation := &PlanInvitation{}
	err := r.db.NewSelect().Model(planInvitation).Where("id = ?", id).Scan(ctx)
	if err != nil {
		return nil, err
	}
	return planInvitation, nil
}

func (r *Repository) CreateExpense(ctx context.Context, payload *Expense) error {
	_, err := r.db.NewInsert().Model(payload).Returning("*").Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) AddExpenseParticipant(ctx context.Context, payload *ExpenseParticipant) error {
	_, err := r.db.NewInsert().Model(payload).Returning("*").Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) GetExpensesByPlan(ctx context.Context, planID int64) ([]Expense, error) {
	PlanExpenses := []Expense{}
	err := r.db.NewSelect().Model(&PlanExpenses).Where("plan_id = ?", planID).Scan(ctx)
	if err != nil {
		return nil, err
	}
	return PlanExpenses, nil
}

func (r *Repository) GetTotalExpenseAmount(ctx context.Context, planID int64) (float64, error) {
	var total float64
	err := r.db.NewSelect().Column("SUM(amount)").Table("expenses").Where("plan_id = ?", planID).Scan(ctx, &total)
	if err != nil {
		return 0, err
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
