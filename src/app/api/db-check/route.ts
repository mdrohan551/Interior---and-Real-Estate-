import { healthService } from "@/modules/health/services/health.service";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET() {
  const health = await healthService.getSystemHealth();

  if (health.database.connected) {
    return apiSuccess(health.database, "PostgreSQL Database connected successfully");
  }

  return apiError(
    "Failed to connect to PostgreSQL Database",
    "DATABASE_CONNECTION_ERROR",
    500,
    health.database
  );
}
