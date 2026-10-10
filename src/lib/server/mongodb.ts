import "server-only";
import { MongoClient, type Db } from "mongodb";
import { serverEnv } from "./env";

// Reuse one client across hot reloads in dev and across invocations of a warm serverless instance.
const globalForMongo = globalThis as typeof globalThis & { _mongoClient?: Promise<MongoClient> };

function getClient(): Promise<MongoClient> {
  globalForMongo._mongoClient ??= new MongoClient(serverEnv.mongodbUri).connect().catch((error) => {
    globalForMongo._mongoClient = undefined;
    throw error;
  });
  return globalForMongo._mongoClient;
}

export async function getDb(): Promise<Db> {
  return (await getClient()).db(serverEnv.mongodbDb);
}
