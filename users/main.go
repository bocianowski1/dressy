package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/bocianowski1/users/auth"
	"github.com/bocianowski1/users/db"
	"github.com/bocianowski1/users/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func main() {

	db.Init()
	auth.NewGoogleAuth()
	server := NewServer()

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}

func NewServer() *http.Server {
	server := &http.Server{
		Addr:         ":6060",
		Handler:      RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}

func RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	// Email/Password
	r.Post("/login", handlers.HandleLogin)
	r.Post("/register", handlers.HandleRegister)

	// Google OAuth
	r.Get("/auth/{provider}/callback", handlers.HandleGoogleCallback)
	r.Get("/auth/{provider}", handlers.HandleGoogleLogin)
	r.Get("/google/logout", handlers.HandleGoogleLogout)

	return r
}
