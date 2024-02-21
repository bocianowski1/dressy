package main

import (
	"log"
	"os"

	"github.com/bocianowski1/users/db"
	"github.com/bocianowski1/users/handlers"
	"github.com/bocianowski1/users/middleware"

	"github.com/gofiber/fiber/v2"
)

func main() {
	db.Init()

	app := fiber.New()
	setupRoutes(app)

	log.Fatal(app.Listen(":8080"))
}

func setupRoutes(app *fiber.App) {
	// auth
	app.Post("/auth/login", handlers.HandleLogin)
	app.Post("/auth/register", handlers.HandleRegister)

	// sessions
	app.Get("/sessions", handlers.HandleGetSessionByID)
	app.Post("/sessions", handlers.HandlePostSession)
	app.Delete("/sessions", handlers.HandleDeleteSession)

	app.Get("/users/:username/exists", handlers.HandleUserExistsUnprotected)

	// JWT Middleware
	jwt := middleware.NewAuthMiddleware(os.Getenv("SIGNING_KEY"))

	// users
	app.Get("/users", jwt, handlers.HandleGetUsers)
	app.Get("/users/:username", jwt, handlers.HandleGetUserByUsername)

}
