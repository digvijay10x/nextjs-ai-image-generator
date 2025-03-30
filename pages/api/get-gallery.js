import dbConnect from "@/lib/mongodb";
import Image from "@/models/Image";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const images = await Image.find().select(
      "title imageUrl uploadedByUsername upvotes upvotedBy"
    );

    return res.status(200).json(images);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
