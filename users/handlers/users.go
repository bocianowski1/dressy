package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/bocianowski1/users/db"
	"github.com/go-chi/chi"
)

func HandleGetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := db.GetUsers()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func HandleGetUserByUsername(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")

	user, err := db.GetUserByUsername(username)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if user == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}
