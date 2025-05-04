import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/drizzle/schema";

const pg = neon(process.env.DATABASE_URL!);
export const db = drizzle(pg, { schema }); 