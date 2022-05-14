import { clearCookie } from "../../lib/cookie-util";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({ success: false, message: "BAD Request Method" });
  }
  clearCookie(res);
  return res.status(200).json({ success: true, message: "Logged user out successfully" });
}
