package users

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

func (r *Repository) CreateUser(user *User) error {
	_, err := r.db.NewInsert().Model(user).Returning("*").Exec(context.Background())
	if err != nil {
		fmt.Println("Failed to create user db", err)
	}
	return err
}

func (r *Repository) GetUserByID(id int64) (*User, error) {
	user := &User{}
	err := r.db.NewSelect().Model(user).Where("id = ?", id).Scan(context.Background())
	if err != nil {
		return nil, err
	}
	return user, nil
}
