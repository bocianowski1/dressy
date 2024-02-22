package main

import (
	"log"

	"github.com/bocianowski1/payments/handlers"
	"github.com/gofiber/fiber/v2"
)

func main() {
	// db.Init()

	app := fiber.New()
	registerRoutes(app)

	log.Fatal(app.Listen(":5555"))
}

func registerRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendStatus(200)
	})
	app.Post("/create-payment-intent", handlers.HandleCreatePaymentIntent)
}
