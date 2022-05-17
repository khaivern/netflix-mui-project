import { NextResponse } from "next/server";
import { decodeToken } from "../lib/token-util";

export async function middleware(req) {
  const token = req.cookies["token"];
  const decodedToken = token && (await decodeToken(token));
  const pathname = req.nextUrl["pathname"];

  if (decodedToken?.issuer || pathname.includes("/static")) {
    return NextResponse.next();
  }

  if (!decodedToken?.issuer || pathname.includes("login")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
}
