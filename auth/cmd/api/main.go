package main

import (
	"auth/internal/auth"
	"auth/internal/server"
	"fmt"
)

func main() {

	auth.NewGoogleAuth()
	server := server.NewServer()

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
