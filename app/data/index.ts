import type { Collection, Clothing } from "../constants/types";

export const collections: Collection[] = [
  {
    id: 1,
    title: "Urban",
    source: require("../assets/images/green-puff.png"),
    font: {
      fontFamily: "urban",
    },
  },
  {
    id: 2,
    title: "Sleek",
    source: require("../assets/images/alien-puff.png"),
    font: {
      fontFamily: "sleek",
    },
  },
  {
    id: 3,
    title: "Classic",
    source: require("../assets/images/red-blue-landscape.png"),
    font: {
      fontFamily: "classic",
      fontSize: 42,
    },
  },
];

export const clothing: Clothing[] = [
  {
    id: 1,
    title: "Red Coat",
    source: require("../assets/images/red-coat.png"),
    price: 299.0,
    collection: "Classic",
    font: {
      fontFamily: "classic",
      fontSize: 32,
    },
  },
  {
    id: 2,
    title: "Silver Jacket",
    source: require("../assets/images/silver-jacket.png"),
    price: 359.0,
    collection: "Urban",
    font: {
      fontFamily: "urban",
      fontSize: 24,
    },
  },
  {
    id: 3,
    title: "Blue Dress",
    source: require("../assets/images/blue-dress.png"),
    price: 399.0,
    collection: "Sleek",
    font: {
      fontFamily: "sleek",
      fontSize: 28,
    },
  },
  {
    id: 4,
    title: "Green Dress",
    source: require("../assets/images/green-dress.png"),
    price: 199.0,
    collection: "Classic",
    font: {
      fontFamily: "classic",
      fontSize: 32,
    },
  },
  {
    id: 5,
    title: "Alien Puff",
    source: require("../assets/images/alien-puff.png"),
    price: 499.0,
    collection: "Sleek",
    font: {
      fontFamily: "sleek",
      fontSize: 28,
    },
  },
  {
    id: 6,
    title: "Green Puff",
    source: require("../assets/images/green-puff.png"),
    price: 549.0,
    collection: "Urban",
    font: {
      fontFamily: "urban",
      fontSize: 24,
    },
  },
];
