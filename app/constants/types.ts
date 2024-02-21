export type User = {
  ID: number;
  username: string;
  name: string;
  email: string;
  imageURL: string;
  // password: string;
};

export type Message = {
  ID: number;
  sender: string;
  receiver: string;
  content: string;
  CreatedAt: string;
};

export type Collection = {
  id: number;
  title: string;
  source: any;
  font?: {
    fontFamily?: string;
    fontSize?: number;
  };
};

export type Clothing = {
  id: number;
  title: string;
  source: any;
  price: number;
  collection: string;
  font?: {
    fontFamily?: string;
    fontSize?: number;
  };
};
