"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const VideoGeneration = () => {
  const { data: session } = useSession();
  const [videoUrl, setVideoUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please enter a valid prompt.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/generate-video", { prompt });
      if (response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
      } else {
        throw new Error("No video URL in response");
      }
    } catch (error) {
      console.error("❌ Error generating video:", error);
      alert("Failed to generate video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !videoUrl) {
      alert("Please provide a title and generate a video before uploading.");
      return;
    }

    if (!session) {
      alert("You must be logged in to upload!");
      return;
    }

    setIsUploading(true);
    try {
      const response = await axios.post("/api/upload-video", {
        title,
        videoUrl,
        uploadedBy: session.user.email,
      });

      if (response.status === 201) {
        alert("✅ Video uploaded successfully!");
        setTitle("");
        setVideoUrl("");
      }
    } catch (error) {
      console.error("❌ Error uploading video:", error);
      alert("❌ Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        AI Video Generator
      </h1>
      <div className="w-full max-w-lg h-96 mb-8 overflow-hidden rounded-xl shadow-2xl relative">
        {videoUrl ? (
          <video controls src={videoUrl} className="w-full h-full"></video>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-800">
            <span className="text-gray-500">
              Generated video will appear here
            </span>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      <form onSubmit={handleGenerate} className="w-full max-w-lg flex gap-4">
        <input
          type="text"
          placeholder="Describe the video you want to generate"
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
      {videoUrl && (
        <div className="mt-8 w-full max-w-lg">
          <input
            type="text"
            placeholder="Title for your video"
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

export default VideoGeneration;
