import { useSQLiteContext } from 'expo-sqlite/next';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from 'schema';

export const useDB = () => {
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });
  return db;
};
