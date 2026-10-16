import { propertyRepository } from "../repositories/property.repository";
import { CreatePropertySchema, CreatePropertyDTO } from "../validators/property.validator";
import { logger } from "@/lib/logger";

export class PropertyService {
  async getAllProperties() {
    logger.info("Fetching all properties", { module: "property", action: "getAllProperties" });
    return await propertyRepository.findAll();
  }

  async getPropertyById(id: string) {
    if (!id) {
      throw new Error("Property ID is required");
    }
    const property = await propertyRepository.findById(id);
    if (!property) {
      throw new Error(`Property with ID ${id} not found`);
    }
    return property;
  }

  async createProperty(data: CreatePropertyDTO) {
    // Validate input using Zod validator
    const validatedData = CreatePropertySchema.parse(data);

    logger.info("Creating new property listing", {
      module: "property",
      action: "createProperty",
      title: validatedData.title,
    });

    return await propertyRepository.create(validatedData);
  }
}

export const propertyService = new PropertyService();
