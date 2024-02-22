package auth

import (
	"fmt"

	"github.com/gorilla/sessions"
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
	// err := godotenv.Load()
	// if err != nil {
	// 	panic("Error loading .env file")
	// }

	// 	COOKIE_STORE_KEY=secret
	// GOOGLE_CLIENT_ID=30532408938-ir339dgfujojvlmhbfcten6qob8j435u.apps.googleusercontent.com
	// GOOGLE_CLIENT_SECRET=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

	cookieStoreKey := "secret"
	googleClientID := "30532408938-ir339dgfujojvlmhbfcten6qob8j435u.apps.googleusercontent.com"
	googleClientSecret := "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"
	// cookieStoreKey := os.Getenv("COOKIE_STORE_KEY")
	// googleClientID := os.Getenv("GOOGLE_CLIENT_ID")
	// googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	if cookieStoreKey == "" || googleClientID == "" || googleClientSecret == "" {
		panic("Missing environment variables")
	} else {
		fmt.Println("cookieStoreKey: ", cookieStoreKey)
	}

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
