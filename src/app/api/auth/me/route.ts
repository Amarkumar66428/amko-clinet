import { NextResponse, type NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { TOKEN_COOKIE } from "@/lib/auth";
import { publicUser, verifySession } from "@/lib/server/session";
import { findUserById } from "@/lib/server/users";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  if (!session || !ObjectId.isValid(session.sub)) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const user = await findUserById(new ObjectId(session.sub));
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 401 });

  return NextResponse.json({ data: publicUser(user) });
}
