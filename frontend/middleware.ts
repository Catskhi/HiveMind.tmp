import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const jwt_cookie = request.cookies.get("JWT_TOKEN")?.value
    const { pathname } = request.nextUrl

    if (!jwt_cookie) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
        const response = await fetch(`${baseUrl}/auth/verify`, {
            headers: { "Cookie": `JWT_TOKEN=${jwt_cookie}` },
        }); 
        if (!response.ok) {
            throw new Error(`Authentication failed with status: ${response.status}`)
        }
        return NextResponse.next()
    } catch (error) {
        let redirectPath = "/login"
        if (error.status === 403) redirectPath = "/login"
        if (error.code === "ERR_NETWORK") redirectPath = "/demo"

        const response = NextResponse.redirect(new URL(redirectPath, request.url))
        response.cookies.delete("JWT_TOKEN")
        return response
    }
}
 
export const config = {
    matcher: ["/app/:path*"]
};