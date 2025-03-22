import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        await cookies()
        const cookie = req.cookies.get("JWT_TOKEN")?.value;
        if (!cookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(cookie, secret) as { name: string };

        return NextResponse.json({ message: "success", username: decoded.name });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
