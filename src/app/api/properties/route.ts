import { NextRequest } from "next/server";
import { propertyService } from "@/modules/property/services/property.service";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET() {
  try {
    const properties = await propertyService.getAllProperties();
    return apiSuccess(properties, "Properties retrieved successfully");
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Failed to fetch properties",
      "PROPERTIES_FETCH_FAILED",
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProperty = await propertyService.createProperty(body);
    return apiSuccess(newProperty, "Property created successfully", 201);
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Invalid property data",
      "PROPERTY_CREATION_FAILED",
      400
    );
  }
}
