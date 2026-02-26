import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Direct URL for CLI commands (migrations, introspection)
    url: process.env.DIRECT_URL!,
  },
});
