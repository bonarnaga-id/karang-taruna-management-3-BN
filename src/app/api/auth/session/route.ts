import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
        name: session.name
      }
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: "Sesi tidak valid" },
      { status: 401 }
    );
  }
}
