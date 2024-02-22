package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/bocianowski1/users/db"
	jwt "github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	var loginReq LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		log.Println("Error unmarshalling login request", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	username := loginReq.Username
	pass := loginReq.Password

	if username == "" || pass == "" {
		log.Println("Username or password empty")
		http.Error(w, "Username or password empty", http.StatusBadRequest)
		return
	}

	user, err := db.GetUserByUsername(username)
	if err != nil {
		log.Println("Error getting user", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if user == nil {
		log.Println("User not found")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if user.Password != pass {
		log.Println("Wrong password")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 8).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signKey := os.Getenv("SIGNING_KEY")

	if signKey == "" {
		log.Println("SIGNING_KEY not set")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	t, err := token.SignedString([]byte(signKey))
	if err != nil {
		log.Println("Error signing token", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"token": t, "user": user})
}
