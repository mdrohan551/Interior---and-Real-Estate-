export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: "residential" | "commercial" | "interior";
  status: "available" | "pending" | "sold";
  createdAt: Date;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  price: number;
  location: string;
  category: "residential" | "commercial" | "interior";
}
