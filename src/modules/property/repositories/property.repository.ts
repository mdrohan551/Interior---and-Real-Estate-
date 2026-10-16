import { executeQuery } from "@/lib/db/client";
import { Property, CreatePropertyInput } from "../types/property.types";

export class PropertyRepository {
  private initPromise: Promise<void> | null = null;

  private async ensureTableExists(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = (async () => {
        await executeQuery(`
          CREATE TABLE IF NOT EXISTS properties (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC(12, 2) NOT NULL,
            location VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT 'available',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
      })();
    }
    return this.initPromise;
  }

  async findAll(): Promise<Property[]> {
    await this.ensureTableExists();
    const res = await executeQuery<Property>(
      "SELECT id, title, description, price, location, category, status, created_at as \"createdAt\" FROM properties ORDER BY created_at DESC;"
    );
    return res.rows;
  }

  async findById(id: string): Promise<Property | null> {
    await this.ensureTableExists();
    const res = await executeQuery<Property>(
      "SELECT id, title, description, price, location, category, status, created_at as \"createdAt\" FROM properties WHERE id = $1;",
      [id]
    );
    return res.rows[0] || null;
  }

  async create(input: CreatePropertyInput): Promise<Property> {
    await this.ensureTableExists();
    const id = crypto.randomUUID();
    const res = await executeQuery<Property>(
      `INSERT INTO properties (id, title, description, price, location, category, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'available')
       RETURNING id, title, description, price, location, category, status, created_at as "createdAt";`,
      [id, input.title, input.description, input.price, input.location, input.category]
    );
    return res.rows[0];
  }
}

export const propertyRepository = new PropertyRepository();
