import dbConnect from "@/lib/mongodb";
import Image from "@/models/Image";
import User from "@/models/User"; // Import User model

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { title, imageUrl, uploadedBy } = req.body;

    // Validate request body
    if (!title || !imageUrl || !uploadedBy) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Prevent duplicate uploads
    const existingImage = await Image.findOne({ imageUrl });
    if (existingImage) {
      return res.status(409).json({ error: "Image already uploaded" });
    }

    // Fetch user using email
    const user = await User.findOne({ email: uploadedBy });

    // If user is not found, return an error
    if (!user) {
      return res.status(400).json({
        error: "User profile not found. Please create a profile first.",
      });
    }

    // Save new image with username
    const newImage = await Image.create({
      title,
      imageUrl,
      uploadedBy,
      uploadedByUsername: user.username, // Use the actual username from the found user
    });

    return res.status(201).json({
      message: "Image uploaded successfully!",
      image: newImage,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
