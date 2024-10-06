"use client";

import { useState } from "react";
import axios from "axios"; // Axios for making API requests

const ImageGeneration = () => {
  const [imageUrl, setImageUrl] = useState("/image_placeholder.png"); // Placeholder image
  const [prompt, setPrompt] = useState(""); // Input prompt state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true); // Start loading
    try {
      // Send POST request to the API route with the prompt
      const response = await axios.post("/api/generate-image", { prompt });
      setImageUrl(response.data.imageUrl); // Set the generated image URL
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-4">
        AI image <span className="text-blue-500">generator</span>
      </h1>
      <div className="w-full max-w-md h-64 mb-4 overflow-hidden rounded-lg bg-gray-800">
        <img
          src={imageUrl}
          alt="Generated image"
          className="w-full h-full object-cover"
        />
        {isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        )}
      </div>
      <form onSubmit={handleGenerate} className="w-full max-w-md flex gap-2">
        <input
          type="text"
          placeholder="Describe What You Want To See"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow bg-gray-800 border-gray-700 text-white placeholder-gray-400 p-2 rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
};

export default ImageGeneration;
