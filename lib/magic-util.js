import { Magic } from "magic-sdk";
import { Magic as MagicServer } from "@magic-sdk/admin";
// For client side
export const constructMagicSDKInstance = () => {
  return typeof window !== "undefined" && new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
};

// For server side
export const constructMagicServerSDKInstance = () => {
  return new MagicServer(process.env.MAGIC_SERVER_KEY);
};

export const extractMagicUserMetadata = async (headers) => {
  const { authorization } = headers;
  try {
    if (!authorization) {
      throw new Error("No Authorization found");
    }
    const DIDToken = authorization.slice(7);

    const magic = constructMagicServerSDKInstance();
    const metadata = await magic.users.getMetadataByToken(DIDToken);
    return { metadata, DIDToken };
  } catch (err) {
    console.log(err);
    return { metadata: null, DIDToken: null };
  }
};
