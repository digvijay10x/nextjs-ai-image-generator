import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json(user);
    }

    if (req.method === "POST") {
      const { email, name, username, bio } = req.body;

      if (!email || !name || !username) {
        return res
          .status(400)
          .json({ error: "Email, Name, and Username are required" });
      }

      let user = await User.findOne({ email });

      // Check if username is already taken by another user
      const existingUsername = await User.findOne({
        username,
        email: { $ne: email },
      });
      if (existingUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      if (!user) {
        user = await User.create({ email, name, username, bio });
      } else {
        user.name = name;
        user.username = username;
        user.bio = bio;
        await user.save();
      }

      return res.status(200).json(user);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
