package db

import "log"

func Seed() {
	admin := &User{
		Username:  "admin",
		Email:     "addy.m@gmail.com",
		Name:      "Addy",
		Password:  "admin",
		Followers: []*User{},
		Following: []*User{},
	}
	guest := &User{
		Username:  "guest",
		Email:     "gustav.gg@gmail.com",
		Name:      "Gus",
		Password:  "guest",
		Followers: []*User{},
		Following: []*User{},
	}
	Db.Create(admin)
	Db.Create(guest)
	log.Println("Seeded the database")
}
