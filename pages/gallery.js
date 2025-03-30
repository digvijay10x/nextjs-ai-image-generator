"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("user_123"); // Replace with actual user ID
  const [userUpvotes, setUserUpvotes] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/get-gallery");
        setImages(response.data || []);

        const initialUpvotes = {};
        response.data?.forEach((img) => {
          initialUpvotes[img._id] = img.upvotedBy?.includes(userId) || false;
        });
        setUserUpvotes(initialUpvotes);
      } catch (error) {
        console.error("❌ Error fetching gallery images:", error);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [userId]);

  const handleToggleUpvote = async (imageId) => {
    try {
      const response = await axios.post("/api/toggle-upvote", {
        imageId,
        userId,
      });

      setImages((prevImages) =>
        prevImages.map((img) =>
          img._id === imageId ? { ...img, upvotes: response.data.upvotes } : img
        )
      );

      setUserUpvotes((prev) => ({
        ...prev,
        [imageId]: response.data.hasUpvoted, // API returns updated upvote state
      }));
    } catch (error) {
      console.error("❌ Error toggling upvote:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Gallery
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Discover and upvote amazing images
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-10 text-center">
            <p className="text-gray-400 text-lg">No images uploaded yet.</p>
            <p className="text-gray-500 mt-2">
              Be the first to share your work!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image._id}
                className="group relative bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {image.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    By{" "}
                    <span className="text-blue-400 font-medium">
                      @{image.uploadedByUsername || "Unknown"}
                    </span>
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleUpvote(image._id);
                    }}
                    className={`w-full py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 z-20 relative ${
                      userUpvotes[image._id]
                        ? "bg-purple-600 text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    }`}
                  >
                    <span>{userUpvotes[image._id] ? "❤️" : "👍"}</span>
                    <span>{userUpvotes[image._id] ? "Upvoted" : "Upvote"}</span>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm ml-1">
                      {image.upvotes || 0}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
