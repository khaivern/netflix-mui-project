import { getUserFavouritedVideoIds } from "../../../lib/hasura-util";
import { getListOfVideosByVideoIds } from "../../../lib/videos-util";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({ message: "BAD Request Method" });
  }

  try {
    const { token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const videoIds = await getUserFavouritedVideoIds({ userId: decodedToken.issuer, token });
    const videos = await getListOfVideosByVideoIds(videoIds);
    return res.status(200).json({ message: "Successfully fetched videos", videos });
  } catch (err) {
    // console.log(err);
    return res
      .status(500)
      .json({ message: "Server error, failed requesting list of videos from Youtube" });
  }
}
