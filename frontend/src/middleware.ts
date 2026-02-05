import { type NextRequest, NextResponse } from "next/server";

// Since we're using localStorage for auth (client-side only),
// we can't check auth status in middleware (server-side).
// Auth protection is handled client-side in the dashboard page.
// This middleware just passes through all requests.

export default function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
