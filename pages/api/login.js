import jwt from "jsonwebtoken";
import { createCookie } from "../../lib/cookie-util";
import { createNewUser, isNewUser } from "../../lib/hasura-util";
import { extractMagicUserMetadata } from "../../lib/magic-util";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(500).json({ message: "BAD Request Method" });
  }

  try {
    const { metadata, DIDToken } = await extractMagicUserMetadata(req.headers);
    if (!metadata || !DIDToken) {
      throw new Error("null metadata and/or DIDToken");
    }
    // For Hasura JWT Authentication
    const token = jwt.sign(
      {
        ...metadata,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user", "admin"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": metadata.issuer,
        },
      },
      process.env.JWT_SECRET_KEY
    );

    const newUser = await isNewUser(token, metadata.issuer);
    newUser && (await createNewUser(token, { email: metadata.email, issuer: metadata.issuer }));
    createCookie({ token, DIDToken }, res);
    return res.status(200).json({ success: true, message: "Success, logged user in" });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ success: false, message: "Failed to login" });
  }
}
