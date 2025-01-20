"use client";

import { useState } from "react";
import axios from "axios";

const ImageGeneration = () => {
  const [imageUrl, setImageUrl] = useState("/image_placeholder.png");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please enter a valid prompt.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/generate-image", {
        prompt,
      });
      if (response.data.imageUrl) {
        setImageUrl(response.data.imageUrl);
      } else {
        throw new Error("No image URL in response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!title || !imageUrl) {
      alert("Please provide a title and generate an image before uploading.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await axios.post("/api/upload-art", {
        title,
        imageUrl,
      });
      if (response.status === 200) {
        alert("Artwork uploaded successfully!");
        setTitle("");
        setImageUrl("/image_placeholder.png"); // Reset the image
      }
    } catch (error) {
      console.error("Error uploading artwork:", error);
      alert("Failed to upload artwork. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-4">
        AI image <span className="text-blue-500">generator</span>
      </h1>
      <div className="w-full max-w-md h-64 mb-4 overflow-hidden rounded-lg bg-gray-800 relative">
        <img
          src={imageUrl}
          alt="Generated image"
          className="w-full h-full object-cover"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
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
      {imageUrl !== "/image_placeholder.png" && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Title for your artwork"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white p-2 rounded mb-2"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
          >
            {isUploading ? "Uploading..." : "Upload to Gallery"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGeneration;
