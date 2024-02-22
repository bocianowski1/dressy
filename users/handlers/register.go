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

type RegisterRequest struct {
	Username string `json:"username"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	var registerReq RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&registerReq); err != nil {
		log.Println("Error unmarshalling register request", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	username := registerReq.Username
	name := registerReq.Name
	pass := registerReq.Password

	if username == "" || pass == "" || name == "" {
		log.Println("Username, name, or password empty")
		http.Error(w, "Username, name, or password empty", http.StatusBadRequest)
		return
	}

	user, err := db.GetUserByUsername(username)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if user != nil {
		log.Println("User already exists")
		http.Error(w, "User already exists", http.StatusBadRequest)
		return
	}

	user = &db.User{
		Username: username,
		Name:     name,
		Password: pass,
	}

	if err := db.CreateUser(user); err != nil {
		log.Println("Error creating user", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
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
