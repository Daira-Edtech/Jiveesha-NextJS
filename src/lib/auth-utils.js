import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function getAuthenticatedUser(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return {
      session,
      userId: session?.user?.id || null,
      user: session?.user || null,
    };
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return {
      session: null,
      userId: null,
      user: null,
    };
  }
}

export async function requireAuth(request) {
  const { session, userId, user } = await getAuthenticatedUser(request);

  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { session, userId, user };
}

export function withAuth(handler) {
  return async function (request, context) {
    const authResult = await requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { session, userId, user } = authResult;
    
    return handler(request, context, { session, userId, user });
  };
}
