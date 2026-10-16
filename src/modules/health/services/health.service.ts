import { healthRepository } from "../repositories/health.repository";
import { logger } from "@/lib/logger";

export class HealthService {
  async getSystemHealth() {
    try {
      const dbStatus = await healthRepository.pingDatabase();
      logger.info("Health check executed successfully", { module: "health", action: "getSystemHealth" });

      return {
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: dbStatus,
      };
    } catch (error) {
      logger.error("Database health check failed", {
        module: "health",
        action: "getSystemHealth",
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        status: "degraded",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: error instanceof Error ? error.message : "Database unavailable",
        },
      };
    }
  }
}

export const healthService = new HealthService();
