import { executeQuery } from "@/lib/db/client";

export class HealthRepository {
  async pingDatabase() {
    const res = await executeQuery("SELECT NOW() as current_time, version();");
    return {
      connected: true,
      timestamp: res.rows[0].current_time,
      version: res.rows[0].version,
    };
  }
}

export const healthRepository = new HealthRepository();
