import { NextResponse, type NextRequest } from "next/server";
import { EMAIL_RULE, PASSWORD_RULE } from "@/lib/authService";
import { hashPassword } from "@/lib/server/password";
import { publicUser, startSession } from "@/lib/server/session";
import { createPasswordUser } from "@/lib/server/users";

const MAX_NAME_LENGTH = 50;

function badRequest(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

// Creates an email/password account and signs the new user in.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!firstName || !lastName || !email || !password) return badRequest("Please fill all the fields");
  if (firstName.length > MAX_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH) return badRequest("Name is too long");
  if (!EMAIL_RULE.test(email)) return badRequest("Please enter a valid email address");
  if (!PASSWORD_RULE.test(password)) {
    return badRequest(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    );
  }

  try {
    const user = await createPasswordUser({ email, firstName, lastName, passwordHash: await hashPassword(password) });
    if (!user) return badRequest("An account with this email already exists", 409);

    const response = NextResponse.json({ data: publicUser(user) }, { status: 201 });
    await startSession(request, response, user);
    return response;
  } catch (error) {
    console.error("Registration failed", error);
    return badRequest("Registration failed, please try again", 500);
  }
}
