package handlers

import (
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/paymentintent"
)

func HandleCreatePaymentIntent(c *fiber.Ctx) error {
	stripe.Key = "sk_test_51OmgDGB5rVWwVVGYxZCm35CJT1MRBZ1PvYyqrT5Rk3gjOwjOYBgmZRyAMrHt01eVS0gYue4bPiJbBgmeTgPy1J6H00l3hAx8JU"
	type productReq struct {
		ProductID string  `json:"product_id"`
		Price     float64 `json:"price"`
	}

	var product productReq
	if err := c.BodyParser(&product); err != nil {
		log.Println("Error unmarshalling product request", err)
		return c.Status(http.StatusBadRequest).SendString("Bad request")
	}

	log.Printf("Price: %v", product.Price)

	// productID := strconv.FormatUint(uint64(product.Price), 10)

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(int64(product.Price)), // øre to NOK conversion
		Currency: stripe.String(string(stripe.CurrencyNOK)),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		log.Println("Error creating payment intent", err)
		return c.Status(http.StatusInternalServerError).SendString("Internal server error")
	}

	log.Printf("pi.New: %v", pi.ClientSecret)

	return c.JSON(fiber.Map{
		"payment_intent": pi.ClientSecret,
		"customer_id":    "cus_J9",
		"ephemeral_key":  "ek_test_1",
	})
}
