package main

import (
	"log"
	"os"

	"github.com/bocianowski1/payments/db"
	"github.com/bocianowski1/payments/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v76"
)

func main() {
	db.Init()

	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	app := fiber.New()
	setupRoutes(app)

	log.Fatal(app.Listen(":5555"))
}

func setupRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendStatus(200)
	})
	app.Get("/checkout-session", handlers.HandleCheckoutSession)
}
