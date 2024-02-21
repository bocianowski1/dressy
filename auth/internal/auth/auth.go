package auth

import (
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

const (
	maxAge      = 86400
	isProd      = false
	callbackURL = "http://localhost:6060/auth/google/callback"
)

func NewGoogleAuth() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	cookieStoreKey := os.Getenv("COOKIE_STORE_KEY")
	googleClientID := os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	store := sessions.NewCookieStore([]byte(cookieStoreKey))
	store.Options = &sessions.Options{
		MaxAge:   maxAge,
		Path:     "/",
		HttpOnly: true,
		Secure:   isProd,
	}

	gothic.Store = store
	goth.UseProviders(
		google.New(googleClientID, googleClientSecret, callbackURL),
	)
}
