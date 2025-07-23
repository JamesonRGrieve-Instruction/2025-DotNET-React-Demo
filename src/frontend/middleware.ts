import { NextResponse } from "next/server";

function validateJWT(jwt) {
  return false;
}
export default async function Middleware(req) {
  console.log(req.cookies.get("jwt")?.value);
  let response = NextResponse.next();
  if (!validateJWT(req.cookies.get("jwt")?.value)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    response = NextResponse.redirect(url);
    response.cookies.set({
      name: "jwt",
      value: "",
      path: "/",
      maxAge: 0,
    });
  }
  return response;
}
export const config = {
  matcher: ["/weather/:path*"],
};
