import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://finance-track_owner:RQdDtZA2qa4M@ep-empty-hat-a536odpf.us-east-2.aws.neon.tech/finance-track?sslmode=require"
);
export const db = drizzle(sql, { schema });
