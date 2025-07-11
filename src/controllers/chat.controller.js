import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token =  generateStreamToken(req.user._id);
    if (!token) {
      return res.status(500).json({ message: "Failed to generate Stream token" });
    }
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}