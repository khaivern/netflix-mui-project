import cookie from "cookie";

const MAX_AGE = 7 * 24 * 60 * 60;
const DEFAULT_COOKIE_OPTIONS = {
  
  expires: new Date(Date.now() + MAX_AGE * 1000),
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

const EXPIRED_COOKIE_OPTIONS = {
  expires: new Date(0),
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export const createCookie = ({ token, DIDToken }, res) => {
  const setHasuraCookie = cookie.serialize("token", token, DEFAULT_COOKIE_OPTIONS);
  const setDIDTokenCookie = cookie.serialize("DIDToken", DIDToken, DEFAULT_COOKIE_OPTIONS);
  res.setHeader("Set-Cookie", [setHasuraCookie, setDIDTokenCookie]);
};

export const clearCookie = (res) => {
  "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  const setHasuraCookie = cookie.serialize("token", null, EXPIRED_COOKIE_OPTIONS);
  const setDIDTokenCookie = cookie.serialize("DIDToken", null, EXPIRED_COOKIE_OPTIONS);
  res.setHeader("Set-Cookie", [setHasuraCookie, setDIDTokenCookie]);
};

export const readCookie = () => {
  return cookie.parse(document.cookie);
};
