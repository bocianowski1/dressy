package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/bocianowski1/users/util"
	"github.com/go-chi/chi"
	"github.com/markbates/goth/gothic"
)

type contextKey string

const providerKey contextKey = "provider"

func HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {

	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(context.Background(), providerKey, provider))

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

	ipAddr, err := util.GetIP()
	if err != nil {
		log.Println("Error getting IP", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Println("IP address: ", *ipAddr)
	deepLinkURL := fmt.Sprintf("exp://%s:8081", *ipAddr)
	redirectURL := fmt.Sprintf("%s?access_token=%s&email=%s&name=%s&avatar_url=%s", deepLinkURL, user.AccessToken, user.Email, user.Name, user.AvatarURL)
	http.Redirect(w, r, redirectURL, http.StatusFound)
}

func HandleGoogleLogout(w http.ResponseWriter, r *http.Request) {
	gothic.Logout(w, r)
	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusTemporaryRedirect)
}

func HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(context.Background(), providerKey, provider))
	gothic.BeginAuthHandler(w, r)
}
