import { jwtVerify } from "jose";

export const decodeToken = async (token) => {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));
    if (!verified) {
      throw new Error("Failed to verify token");
    }
    return verified.payload;
  } catch (err) {
    // console.log(err);
    return {};
  }
};
