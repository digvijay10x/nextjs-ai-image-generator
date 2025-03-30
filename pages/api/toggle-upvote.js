import dbConnect from "@/lib/mongodb";
import Image from "@/models/Image";
import { Types } from "mongoose"; // Import Types from mongoose

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { imageId, userId } = req.body;

    // Input validation
    if (!imageId || !userId) {
      return res
        .status(400)
        .json({ error: "Image ID and User ID are required" });
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ error: "Invalid Image ID format" });
    }

    // Find the image with explicit projection to include upvotedBy
    const image = await Image.findById(imageId).select(
      "title upvotes upvotedBy"
    );

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    console.log("Image before update:", {
      id: image._id,
      upvotes: image.upvotes,
      upvotedBy: image.upvotedBy,
    });

    // Check if upvotedBy array exists, initialize if not
    if (!image.upvotedBy) {
      image.upvotedBy = [];
    }

    // Check if the user has already upvoted
    const hasUpvoted = image.upvotedBy.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      image.upvotedBy = image.upvotedBy.filter((id) => id !== userId);
      image.upvotes = Math.max(0, image.upvotes - 1);
    } else {
      // Add upvote
      image.upvotedBy.push(userId);
      image.upvotes = (image.upvotes || 0) + 1; // Handle case where upvotes is undefined
    }

    console.log("Image after update:", {
      id: image._id,
      upvotes: image.upvotes,
      upvotedBy: image.upvotedBy,
      hasUpvoted: !hasUpvoted,
    });

    // Save the updated image
    await image.save();

    return res.status(200).json({
      message: hasUpvoted ? "Upvote removed!" : "Upvoted successfully!",
      upvotes: image.upvotes,
      hasUpvoted: !hasUpvoted,
    });
  } catch (error) {
    console.error("❌ Toggle Upvote Error:", error);
    // Return a more descriptive error message
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
