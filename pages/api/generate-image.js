import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { prompt } = req.body;
  console.log("Received prompt:", prompt);

  if (!process.env.HUGGING_FACE_API_KEY) {
    console.error("HUGGING_FACE_API_KEY is not set");
    return res.status(500).json({ error: "API key is not configured" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", // model URL
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        timeout: 60000,
      }
    );

    if (response.headers["content-type"].includes("application/json")) {
      // If the response is JSON, it's likely an error message
      const jsonResponse = JSON.parse(
        Buffer.from(response.data).toString("utf8")
      );
      console.error("API returned an error:", jsonResponse);
      return res
        .status(500)
        .json({ error: "API error", details: jsonResponse });
    }

    // Convert the image data to a base64 string
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(
      "Error generating image:",
      error.response?.data
        ? Buffer.from(error.response.data, "binary").toString()
        : error.message
    );
    res.status(500).json({
      error: "Failed to generate image",
      details: error.response?.status
        ? `HTTP ${error.response.status}: ${error.message}`
        : error.message,
    });
  }
}
