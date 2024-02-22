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
	server := &http.Server{
		Addr:         ":6060",
		Handler:      registerRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}

func registerRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	// Email/Password
	r.Post("/auth/login", handlers.HandleLogin)
	r.Post("/auth/register", handlers.HandleRegister)

	// Google OAuth
	r.Get("/auth/{provider}/callback", handlers.HandleGoogleCallback)
	r.Get("/auth/{provider}", handlers.HandleGoogleLogin)
	r.Get("/google/logout", handlers.HandleGoogleLogout)

	return r
}
