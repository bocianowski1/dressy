package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go"
	"github.com/stripe/stripe-go/checkout/session"
)

func HandleCheckoutSession(c *fiber.Ctx) error {
	sessionID := c.Query("sessionId")
	if sessionID == "" {
		log.Println("No session ID provided")
		return c.SendStatus(400)
	}

	s, err := session.Get(sessionID, nil)
	if err != nil {
		log.Println(err)
		return c.SendStatus(500)
	}

	return c.JSON(s)
}

func HandleCreateCheckoutSession(c *fiber.Ctx) error {
	type request struct {
		Quantity int `json:"quantity"`
	}

	var body request
	if err := c.BodyParser(&body); err != nil {
		log.Println(err)
		return c.SendStatus(400)
	}

	quantity, err := strconv.ParseInt(strconv.Itoa(body.Quantity), 10, 64)
	if err != nil {
		log.Println(err)
		return c.SendStatus(400)
	}

	domainURL := "exp://192.168.10.152:8081"

	params := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String(domainURL + "/success.html?session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:  stripe.String(domainURL + "/canceled.html"),
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Quantity: stripe.Int64(quantity),
				Amount:   stripe.Int64(1000),
				Currency: stripe.String(string(stripe.CurrencyNOK)),
			},
		},
		// AutomaticTax: &stripe.CheckoutSessionAutomaticTaxParams{Enabled: stripe.Bool(true)},
	}

	s, err := session.New(params)
	if err != nil {
		return c.Redirect(s.CancelURL, http.StatusTemporaryRedirect)
	}

}
