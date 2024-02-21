package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/markbates/goth/gothic"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/", s.HelloWorldHandler)
	r.Get("/health", s.healthHandler)
	r.Get("/auth/{provider}/callback", s.handleGoogleCallback)
	r.Get("/auth/{provider}", s.handleGoogleLogin)
	r.Get("/logout", s.handleGoogleLogout)

	return r
}

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.db.Health())
	_, _ = w.Write(jsonResp)
}

func (s *Server) handleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(context.Background(), "provider", provider))

	user, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		log.Println("error in CompleteUserAuth", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Println(user.AccessToken)
	fmt.Println(user.Email)
	fmt.Println(user.Name)
	fmt.Println(user.AvatarURL)

	// mobile app redirect deep link
	fmt.Println("redirecting to mobile app")
	deepLinkURL := "exp://192.168.10.152:8081"
	redirectURL := fmt.Sprintf("%s?access_token=%s&email=%s&name=%s&avatar_url=%s", deepLinkURL, user.AccessToken, user.Email, user.Name, user.AvatarURL)
	http.Redirect(w, r, redirectURL, http.StatusFound)
}

func (s *Server) handleGoogleLogout(w http.ResponseWriter, r *http.Request) {
	gothic.Logout(w, r)
	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusTemporaryRedirect)
}

func (s *Server) handleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(context.Background(), "provider", provider))
	gothic.BeginAuthHandler(w, r)
}
