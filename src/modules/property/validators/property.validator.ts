import { z } from "zod";

export const CreatePropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.number().positive("Price must be a positive number"),
  location: z.string().min(2, "Location is required"),
  category: z.enum(["residential", "commercial", "interior"]),
});

export type CreatePropertyDTO = z.infer<typeof CreatePropertySchema>;
