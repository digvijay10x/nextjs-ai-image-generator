// pages/api/generate-image.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "your-model-version-id", // Stable Diffusion model version ID from Replicate
        input: { prompt },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`, // Using API key stored in .env.local
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl = response.data.output[0]; // The generated image URL from Replicate
    res.status(200).json({ imageUrl }); // Send the image URL back to the client
  } catch (error) {
    console.error(
      "Error generating image:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate image" });
  }
}
