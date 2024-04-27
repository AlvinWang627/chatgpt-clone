import type { Database as DB } from "./server/database.types";
declare global {
  type Database = DB;
}
