import "server-only";
import { MongoServerError, type Collection, type ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export interface User {
  _id: ObjectId;
  googleId?: string;
  passwordHash?: string;
  email: string;
  emailVerified: boolean;
  name: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

export interface GoogleProfile {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export interface NewPasswordUser {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

const DUPLICATE_KEY = 11000;
const INDEX_CONFLICT_CODES = [85, 86]; // IndexOptionsConflict, IndexKeySpecsConflict

// Partial so that users who registered with a password (no googleId) don't collide on a missing value.
const GOOGLE_ID_INDEX = {
  key: { googleId: 1 },
  name: "googleId_1",
  unique: true,
  partialFilterExpression: { googleId: { $type: "string" } },
} as const;

async function ensureIndexes(users: Collection<User>): Promise<void> {
  try {
    await users.createIndexes([GOOGLE_ID_INDEX, { key: { email: 1 }, unique: true }]);
  } catch (error) {
    // Older deployments created googleId_1 without the partial filter; replace it once.
    if (!(error instanceof MongoServerError) || !INDEX_CONFLICT_CODES.includes(Number(error.code))) throw error;
    await users.dropIndex(GOOGLE_ID_INDEX.name);
    await users.createIndexes([GOOGLE_ID_INDEX, { key: { email: 1 }, unique: true }]);
  }
}

let indexesReady: Promise<unknown> | undefined;

async function usersCollection(): Promise<Collection<User>> {
  const users = (await getDb()).collection<User>("users");
  indexesReady ??= ensureIndexes(users).catch((error) => {
    indexesReady = undefined;
    throw error;
  });
  await indexesReady;
  return users;
}

export async function upsertGoogleUser(profile: GoogleProfile): Promise<User> {
  const users = await usersCollection();
  const now = new Date();
  const email = profile.email.toLowerCase();
  // A verified Google email links to an existing email/password account instead of failing on the unique email.
  const filter = profile.email_verified
    ? { $or: [{ googleId: profile.sub }, { email, googleId: { $exists: false } }] }
    : { googleId: profile.sub };
  const user = await users.findOneAndUpdate(
    filter,
    {
      $set: {
        googleId: profile.sub,
        email,
        emailVerified: profile.email_verified ?? false,
        name: profile.name || profile.email,
        picture: profile.picture,
        updatedAt: now,
        lastLoginAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" },
  );
  if (!user) throw new Error("Failed to save user");
  return user;
}

/** Returns null when the email is already registered. */
export async function createPasswordUser(input: NewPasswordUser): Promise<User | null> {
  const users = await usersCollection();
  const now = new Date();
  const user: Omit<User, "_id"> = {
    email: input.email.toLowerCase(),
    emailVerified: false,
    name: `${input.firstName} ${input.lastName}`,
    firstName: input.firstName,
    lastName: input.lastName,
    passwordHash: input.passwordHash,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };
  try {
    const { insertedId } = await users.insertOne(user as User);
    return { ...user, _id: insertedId };
  } catch (error) {
    if (error instanceof MongoServerError && error.code === DUPLICATE_KEY) return null;
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return (await usersCollection()).findOne({ email: email.toLowerCase() });
}

export async function recordLogin(id: ObjectId): Promise<void> {
  const now = new Date();
  await (await usersCollection()).updateOne({ _id: id }, { $set: { lastLoginAt: now, updatedAt: now } });
}

export async function findUserById(id: ObjectId): Promise<User | null> {
  return (await usersCollection()).findOne({ _id: id });
}
