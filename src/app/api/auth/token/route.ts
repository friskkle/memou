
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    console.log("Getting token for user", session?.user.id)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);
    const token = await new SignJWT({
        userId: session.user.id,
        username: session.user.name || session.user.email, // Fallback if name is missing
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h") // Token valid for 2 hours
        .sign(secret);

    return NextResponse.json({ token });
}
