package plans

import (
	"time"

	"github.com/uptrace/bun"
)

type Plan struct {
	bun.BaseModel `bun:"table:plans,alias:pl"`

	ID int64 `bun:"id,pk,autoincrement"`

	Title       string  `bun:"title"`
	Description *string `bun:"description"`

	Visibility string `bun:"visibility"`
	Status     string `bun:"status"`

	CreatedBy int64 `bun:"created_by"`

	StartDate *time.Time `bun:"start_date,type:date"`
	EndDate   *time.Time `bun:"end_date,type:date"`

	EstimatedCost *float64 `bun:"estimated_cost"`
	ActualCost    *float64 `bun:"actual_cost"`

	IsDeleted bool `bun:"is_deleted"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}

type PlanMember struct {
	bun.BaseModel `bun:"table:plan_members,alias:pm"`

	ID int64 `bun:"id,pk,autoincrement"`

	PlanID int64 `bun:"plan_id"`
	UserID int64 `bun:"user_id"`

	Role string `bun:"role"`

	JoinedAt time.Time `bun:"joined_at"`

	CreatedAt time.Time `bun:"created_at"`
}

type PlanInvitation struct {
	bun.BaseModel `bun:"table:plan_invitations,alias:piv"`

	ID int64 `bun:"id,pk,autoincrement"`

	PlanID        int64 `bun:"plan_id"`
	InvitedUserID int64 `bun:"invited_user_id"`
	InvitedBy     int64 `bun:"invited_by"`

	Status string `bun:"status"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}

type PlanItem struct {
	bun.BaseModel `bun:"table:plan_items,alias:pi"`

	ID int64 `bun:"id,pk,autoincrement"`

	PlanID  int64  `bun:"plan_id"`
	PlaceID *int64 `bun:"place_id"`

	Title       string  `bun:"title"`
	Description *string `bun:"description"`

	ActivityType *string `bun:"activity_type"`

	StartTime *time.Time `bun:"start_time"`
	EndTime   *time.Time `bun:"end_time"`

	EstimatedCost *float64 `bun:"estimated_cost"`
	ActualCost    *float64 `bun:"actual_cost"`

	Notes *string `bun:"notes"`

	IsDeleted bool `bun:"is_deleted"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}

type PlanItemParticipant struct {
	bun.BaseModel `bun:"table:plan_item_participants,alias:pip"`

	ID int64 `bun:"id,pk,autoincrement"`

	PlanItemID int64 `bun:"plan_item_id"`
	UserID     int64 `bun:"user_id"`

	CreatedAt time.Time `bun:"created_at"`
}

type Expense struct {
	bun.BaseModel `bun:"table:expenses,alias:ex"`

	ID int64 `bun:"id,pk,autoincrement"`

	PlanID     int64  `bun:"plan_id"`
	PlanItemID *int64 `bun:"plan_item_id"`

	Title  string  `bun:"title"`
	Amount float64 `bun:"amount"`

	PaidBy   int64  `bun:"paid_by"`
	Currency string `bun:"currency"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}

type ExpenseParticipant struct {
	bun.BaseModel `bun:"table:expense_participants,alias:ep"`

	ID int64 `bun:"id,pk,autoincrement"`

	ExpenseID int64 `bun:"expense_id"`
	UserID    int64 `bun:"user_id"`

	AmountOwed float64 `bun:"amount_owed"`
	AmountPaid float64 `bun:"amount_paid"`

	CreatedAt time.Time `bun:"created_at"`
}

type Settlement struct {
	bun.BaseModel `bun:"table:settlements,alias:s"`

	ID int64 `bun:"id,pk,autoincrement"`

	PlanID int64 `bun:"plan_id"`

	FromUserID int64 `bun:"from_user_id"`
	ToUserID   int64 `bun:"to_user_id"`

	Amount   float64 `bun:"amount"`
	Currency string  `bun:"currency"`

	Notes *string `bun:"notes"`

	CreatedAt time.Time `bun:"created_at"`
	UpdatedAt time.Time `bun:"updated_at"`
}
