import React from "react";
import { useRouter } from "next/router"; // Import useRouter

const Sections = () => {
  const router = useRouter(); // Initialize the router

  const handleImageGeneration = () => {
    router.push("/image-generation"); // Navigate to image generation page
  };

  return (
    <div className="flex flex-col">
      {/* Main content */}
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Image Generation Section */}
        <div className="w-full md:w-1/2 bg-white p-8 border-r border-gray-200">
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2 text-black">
              Image Generation
            </h2>
            <p className="mb-4 text-gray-700">
              Create unique images from text prompts using advanced AI
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
              <li>High-resolution outputs</li>
              <li>Various styles and themes</li>
              <li>Quick generation time</li>
            </ul>
            <button
              className="mt-auto bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              onClick={handleImageGeneration} // Navigate on button click
            >
              Generate Images
            </button>
          </div>
        </div>

        {/* Video Generation Section */}
        <div className="w-full md:w-1/2 bg-gray-100 p-8">
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2 text-black">
              Video Generation
            </h2>
            <p className="mb-4 text-gray-700">
              Bring your stories to life with AI-generated videos
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
              <li>Custom video durations</li>
              <li>Add text and music</li>
              <li>Multiple output formats</li>
            </ul>
            <button className="mt-auto bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
              Create Videos
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sections;
