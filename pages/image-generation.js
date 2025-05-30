"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const ImageGeneration = () => {
  const { data: session } = useSession();
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
      const response = await axios.post("/api/generate-image", { prompt });
      if (response.data.imageUrl) {
        setImageUrl(response.data.imageUrl);
      } else {
        throw new Error("No image URL in response");
      }
    } catch (error) {
      console.error("❌ Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !imageUrl || imageUrl === "/image_placeholder.png") {
      alert("Please provide a title and generate an image before uploading.");
      return;
    }

    if (!session) {
      alert("You must be logged in to upload!");
      return;
    }

    setIsUploading(true);
    try {
      const response = await axios.post("/api/upload-art", {
        title,
        imageUrl,
        uploadedBy: session.user.email,
      });

      if (response.status === 201) {
        alert("✅ Artwork uploaded successfully!");
        setTitle("");
        setImageUrl("/image_placeholder.png");
      }
    } catch (error) {
      console.error("❌ Error uploading artwork:", error);

      if (error.response?.status === 409) {
        alert("⚠️ This image has already been uploaded!");
      } else {
        alert("❌ Failed to upload artwork. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 leading-[1.2]">
        AI Image Generator
      </h1>

      <div className="w-full max-w-lg h-96 mb-8 overflow-hidden rounded-xl shadow-2xl relative">
        <img
          src={imageUrl}
          alt="Generated image"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      <form onSubmit={handleGenerate} className="w-full max-w-lg flex gap-4">
        <input
          type="text"
          placeholder="Describe What You Want To See"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </form>
      {imageUrl !== "/image_placeholder.png" && (
        <div className="mt-8 w-full max-w-lg">
          <input
            type="text"
            placeholder="Title for your artwork"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-700 text-white p-3 rounded-lg mb-4 focus:outline-none focus:border-green-500 transition-colors"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            {isUploading ? "Uploading..." : "Upload to Gallery"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGeneration;
