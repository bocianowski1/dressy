package middleware

import (
	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

func NewAuthMiddleware(secret string) fiber.Handler {
	var signKey jwtware.SigningKey
	signKey.Key = []byte(secret)

	return func(c *fiber.Ctx) error {
		token := c.Get("Authorization")

		if isGoogleToken(token) {
			isValid := validateGoogleToken(token)
			if !isValid {
				return c.SendStatus(fiber.StatusUnauthorized)
			}

			// You might want to create a user session or perform additional checks here
			// ...

			return c.Next()
		} else {
			return jwtware.New(jwtware.Config{
				SigningKey: signKey,
			})(c)
		}
	}
}

func isGoogleToken(token string) bool {
	// Check if the token is a Google token
	// ex: ya29.a0AfB_byD4knh9lg2D8lJ2EzulPw-S-sbiojfTwNJr11oBNyMrGELSrk_Y6dwN4SOs0VbgKQEJHSX-HAQ73RuXRFZwN3k0fE3qxTDWu1f7JNcCo3n7TOdqVuZd-9SVG6MBKgC31Ckmp6r5d2Vzwmw37w8L63JtUWVPoAaCgYKAXASARESFQHGX2Mi47zCPgSHAeNwHJjqehRLzw0169

	return true
}

func validateGoogleToken(token string) bool {
	// Validate the Google token. You can use Google's API client libraries
	// Extract user information after validation
	// Return whether it's valid and the extracted user info

	return true
}
