package auth

import (
	"fmt"
	"log/slog"

	"github.com/Hacktastic-Labs/wanderlog/internal/users"
	supabaseAuth "github.com/supabase-community/auth-go"
	"github.com/supabase-community/auth-go/types"
)

type AuthService struct {
	supabaseClient  supabaseAuth.Client
	usersRepository *users.Repository
}

func NewAuthService(supabaseClient *supabaseAuth.Client, usersRepository *users.Repository) *AuthService {
	return &AuthService{supabaseClient: *supabaseClient, usersRepository: usersRepository}
}

func (s *AuthService) SignUpWithEmailAndPassword(req UserSignUpRequest) (*types.SignupResponse, error) {
	res, err := s.supabaseClient.Signup(types.SignupRequest{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		fmt.Println("Failed to sign up supabase", err)
		return nil, err
	}
	user := &users.User{
		AuthUserID:  res.User.ID,
		Username:    req.Username,
		DisplayName: req.DisplayName,
	}
	err = s.usersRepository.CreateUser(user)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (s *AuthService) SignInWithEmailAndPassword(email string, password string) (*types.TokenResponse, error) {
	res, err := s.supabaseClient.Token(types.TokenRequest{
		GrantType: "password",
		Email:     email,
		Password:  password,
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (s *AuthService) GetUserFromToken(token string) (*ContextUser, error) {
	client := s.supabaseClient.WithToken(token)
	userInfo, err := client.GetUser()

	if err != nil {
		slog.Error("failed to get auth user", "error", err)
		return nil, fmt.Errorf("auth failed: %w", err)
	}

	dbUserId, err := s.usersRepository.GetUserByAuthID(userInfo.ID)

	if err != nil {
		slog.Error("failed to get db user record", "error", err)
		return nil, fmt.Errorf("auth failed: %w", err)
	}

	return &ContextUser{
		ID:     userInfo.ID,
		Email:  userInfo.Email,
		UserId: dbUserId.ID,
	}, nil
}
