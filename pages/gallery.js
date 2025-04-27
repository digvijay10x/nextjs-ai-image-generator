"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("user_123"); // Replace with actual user ID
  const [userUpvotes, setUserUpvotes] = useState({});
  const [sortOption, setSortOption] = useState("recent"); // 'recent' or 'upvotes'
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'upvoted', or custom categories
  const [isScrolling, setIsScrolling] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/get-gallery");
        let fetchedImages = response.data || [];

        // Filter logic (if needed)
        let filteredImages = fetchedImages;
        if (activeFilter === "upvoted") {
          filteredImages = fetchedImages.filter((img) =>
            img.upvotedBy?.includes(userId)
          );
        }
        // Add more filters as needed

        // Sort logic based on selected option
        if (sortOption === "upvotes") {
          filteredImages.sort((a, b) => b.upvotes - a.upvotes);
        } else if (sortOption === "recent") {
          filteredImages.sort(
            (a, b) =>
              new Date(
                b.createdAt || parseInt(b._id.substring(0, 8), 16) * 1000
              ) -
              new Date(
                a.createdAt || parseInt(a._id.substring(0, 8), 16) * 1000
              )
          );
        }

        setImages(filteredImages);

        const initialUpvotes = {};
        filteredImages.forEach((img) => {
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

    // Add scroll listener for header transparency effect
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    // Add escape key listener to close preview modal
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setPreviewImage(null);
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [userId, sortOption, activeFilter]);

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
        [imageId]: response.data.hasUpvoted,
      }));
    } catch (error) {
      console.error("❌ Error toggling upvote:", error);
    }
  };

  // Function to format the date in a readable way
  const formatDate = (dateString) => {
    const date = new Date(
      dateString || parseInt(dateString?.substring(0, 8), 16) * 1000
    );
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to open image preview
  const openPreview = (image) => {
    setPreviewImage(image);
    // Prevent page scrolling when preview is open
    document.body.style.overflow = "hidden";
  };

  // Function to close image preview
  const closePreview = () => {
    setPreviewImage(null);
    // Re-enable page scrolling
    document.body.style.overflow = "auto";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Fixed header with blur effect when scrolling */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolling
            ? "bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Gallery
              </h1>
              <span className="ml-3 px-3 py-1 text-xs font-medium bg-blue-600 rounded-full">
                Beta
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <div className="flex overflow-x-auto py-1 scrollbar-hide space-x-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === "all"
                      ? "bg-blue-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  All Images
                </button>
                <button
                  onClick={() => setActiveFilter("upvoted")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === "upvoted"
                      ? "bg-blue-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  My Upvotes
                </button>
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-r-4 border-r-transparent"></div>
            <p className="mt-4 text-blue-400">Loading amazing creations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-10 text-center border border-gray-700">
            <div className="inline-flex p-4 rounded-full bg-gray-700/50 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg font-medium">No images found</p>
            <p className="text-gray-400 mt-2">
              {activeFilter === "upvoted"
                ? "You haven't upvoted any images yet. Explore the gallery to find images you like!"
                : "Be the first to share your work!"}
            </p>
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
              >
                View All Images
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image._id}
                className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 border border-gray-800 hover:border-gray-700 cursor-pointer"
                onClick={() => openPreview(image)}
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate">
                      {image.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {formatDate(image.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold mr-2">
                      {(image.uploadedByUsername || "U")[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-blue-400 font-medium">
                      @{image.uploadedByUsername || "Unknown"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleUpvote(image._id);
                    }}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
                      userUpvotes[image._id]
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                    }`}
                  >
                    <span className="text-lg">
                      {userUpvotes[image._id] ? "❤️" : "👍"}
                    </span>
                    <span className="font-medium">
                      {userUpvotes[image._id] ? "Upvoted" : "Upvote"}
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm ml-1 font-medium">
                      {image.upvotes || 0}
                    </span>
                    <div
                      className={`absolute inset-0 bg-white transition-opacity duration-300 ${
                        userUpvotes[image._id] ? "opacity-10" : "opacity-0"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={closePreview}></div>

          <div
            className="relative bg-gray-900 rounded-2xl overflow-hidden max-w-5xl w-full max-h-full flex flex-col md:flex-row animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 z-50 bg-gray-800 bg-opacity-80 rounded-full p-2 hover:bg-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Left side - Image */}
            <div className="flex-grow-0 md:flex-grow md:w-2/3 h-64 md:h-auto relative bg-gray-800">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-16 md:hidden"></div>
            </div>

            {/* Right side - Details */}
            <div className="flex-grow md:w-1/3 p-6 overflow-y-auto max-h-96 md:max-h-screen">
              <h2 className="text-2xl font-bold mb-2">{previewImage.title}</h2>

              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                  {(previewImage.uploadedByUsername || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-blue-400 font-medium">
                    @{previewImage.uploadedByUsername || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(previewImage.createdAt)}
                  </p>
                </div>
              </div>

              {previewImage.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-300">
                    {previewImage.description || "No description provided."}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Details
                </h3>
                <div className="bg-gray-800 rounded-lg p-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Resolution</p>
                    <p className="text-white">
                      {previewImage.width || "?"} × {previewImage.height || "?"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Upvotes</p>
                    <p className="text-white">{previewImage.upvotes || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Created</p>
                    <p className="text-white">
                      {formatDate(previewImage.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">ID</p>
                    <p className="text-white truncate">{previewImage._id}</p>
                  </div>
                </div>
              </div>

              {/* Tags (if available) */}
              {previewImage.tags && previewImage.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {previewImage.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => handleToggleUpvote(previewImage._id)}
                  className={`w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    userUpvotes[previewImage._id]
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                  }`}
                >
                  <span className="text-lg">
                    {userUpvotes[previewImage._id] ? "❤️" : "👍"}
                  </span>
                  <span className="font-medium">
                    {userUpvotes[previewImage._id] ? "Upvoted" : "Upvote"}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm ml-1 font-medium">
                    {previewImage.upvotes || 0}
                  </span>
                </button>

                <button className="w-full py-3 px-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Download</span>
                </button>

                <button className="w-full py-3 px-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>
            Discover and share amazing creations. © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Add some keyframe animations for the modal */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
