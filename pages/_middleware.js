import { NextResponse } from "next/server";
import { decodeToken } from "../lib/token-util";

export async function middleware(req) {
  const token = req.cookies["token"];
  const decodedToken = token && (await decodeToken(token));
  const pathname = req.nextUrl["pathname"];
  
  if (
    decodedToken?.issuer ||
    pathname.includes("/static") ||
    pathname.includes("/api/login") ||
    pathname.includes("/api/signout")
  ) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();

  if (!decodedToken?.issuer && pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
