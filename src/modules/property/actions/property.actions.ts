"use server";

import { propertyService } from "../services/property.service";
import { CreatePropertyDTO } from "../validators/property.validator";

export async function createPropertyAction(formData: CreatePropertyDTO) {
  try {
    const newProperty = await propertyService.createProperty(formData);
    return {
      success: true,
      message: "Property created successfully",
      data: newProperty,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create property",
    };
  }
}
