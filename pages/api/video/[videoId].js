import { getVideoDataByUserId, insertVideoData, updateVideoData } from "../../../lib/hasura-util";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (!["POST", "GET"].includes(req.method)) {
    return res
      .status(500)
      .json({ message: "Invalid Request Method, only accepted are post and get" });
  }

  const token = req.cookies.token;
  const videoId = req.query.videoId;
  if (!videoId || !token) {
    return res.status(500).json({ message: "Video Id or token cannot be empty" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (req.method === "GET") {
    try {
      const videos = await getVideoDataByUserId({
        videoId,
        userId: decodedToken.issuer,
        token,
      });
      if (!videos) {
        throw new Error("Videos returned from hasura are null");
      }

      return res
        .status(200)
        .json({ message: "Video Data returned successfully.", video: videos[0] });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Failed to get video data",
        video: null,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { reaction } = req.body;
      if (![-1, 1, null].includes(reaction)) {
        throw new Error("Invalid reaction recieved");
      }
      const data = await getVideoDataByUserId({ videoId, userId: decodedToken.issuer, token });

      if (!data) {
        throw new Error("Received an error from Hasura when querying for videos");
      }

      const updatedVideoData = {
        favourited: reaction,
        userId: decodedToken.issuer,
        videoId: videoId,
        token: token,
      };

      // video record exists then update the record, otherwise insert a new record.

      data.length > 0
        ? await updateVideoData(updatedVideoData)
        : await insertVideoData(updatedVideoData);

      return res.status(201).json({ success: true, message: "Successfully stored user reaction" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send user video metadata" });
    }
  }
}
