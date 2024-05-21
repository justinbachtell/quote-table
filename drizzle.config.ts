import { env } from "@/env.js";
import { type Config } from "drizzle-kit";

import { dbPrefix } from "@/lib/constants";

export default {
  schema: "./src/db/schema/index.ts",
  driver: "pg",
  out: "./src/db/drizzle",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: [`${dbPrefix}__*`],
} satisfies Config;
