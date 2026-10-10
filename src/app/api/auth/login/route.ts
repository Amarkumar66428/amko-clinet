import { NextResponse, type NextRequest } from "next/server";
import { getDummyHash, verifyPassword } from "@/lib/server/password";
import { publicUser, startSession } from "@/lib/server/session";
import { findUserByEmail, recordLogin } from "@/lib/server/users";

const INVALID_CREDENTIALS = "Invalid email or password";

// Signs in with email/password and sets the same session cookie as Google sign-in.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return NextResponse.json({ message: "Please fill all the fields" }, { status: 400 });

  try {
    const user = await findUserByEmail(email);
    // Always run a hash comparison so unknown emails and Google-only accounts aren't distinguishable by timing.
    const valid = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));
    if (!user?.passwordHash || !valid) return NextResponse.json({ message: INVALID_CREDENTIALS }, { status: 401 });

    await recordLogin(user._id);
    const response = NextResponse.json({ data: publicUser(user) });
    await startSession(request, response, user);
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ message: "Login failed, please try again" }, { status: 500 });
  }
}
