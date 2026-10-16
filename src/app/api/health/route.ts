import { healthService } from "@/modules/health/services/health.service";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function GET() {
  const health = await healthService.getSystemHealth();

  if (health.status === "healthy") {
    return apiSuccess(health, "System is healthy");
  }

  return apiError("System is running in degraded state", "HEALTH_DEGRADED", 503, health);
}
