import { NextRequest, NextResponse } from "next/server";

const AUTH_PAGES = new Set(["/login", "/signup"]);
const LOGGED_USER_COOKIE = "loggedUser";

export default function proxy(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  if (!AUTH_PAGES.has(pathname)) return NextResponse.next();

  const loggedUserCookie = request.cookies.get(LOGGED_USER_COOKIE)?.value;
  if (!loggedUserCookie) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/app";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/login", "/signup"],
};
