import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load environment variables from .env.local
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    // directUrl is optional - only needed for migrations
    ...(process.env.DIRECT_URL && { directUrl: env("DIRECT_URL") }),
  },
});
