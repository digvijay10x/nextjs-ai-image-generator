import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

const Sections = () => {
  const router = useRouter();
  const [hoveredSection, setHoveredSection] = useState(null);

  const handleImageGeneration = () => {
    router.push("/image-generation");
  };

  const SectionContent = ({
    title,
    subtitle,
    listItems,
    buttonText,
    onClick,
    isHovered,
  }) => (
    <div className="h-full flex flex-col justify-between items-center text-center bg-black bg-opacity-50 rounded-xl p-3">
      <div className="flex-grow flex flex-col justify-center items-center overflow-hidden">
        <h2
          className="text-lg font-bold mb-1 cursor-default"
          style={{
            color: "white", // Fixed color for the header
          }}
        >
          {title}
        </h2>
        <p
          className={`mb-1 text-xs transition-all duration-300 ${
            isHovered ? "text-white" : "text-gray-300"
          } cursor-default`}
        >
          {subtitle}
        </p>
        <ul
          className={`list-none text-xs transition-all duration-500 ${
            isHovered ? "text-white" : "text-gray-300"
          } cursor-default ease-in-out transform ${
            isHovered
              ? "opacity-100 max-h-20 mt-1 translate-y-0"
              : "opacity-0 max-h-0 -translate-y-2"
          }`}
          style={{
            transitionProperty: "opacity, max-height, transform",
            color: isHovered ? "white" : "gray",
          }}
        >
          {listItems.map((item, index) => (
            <li
              key={index}
              className="mb-0.5 transition-all duration-500 ease-out"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? `translateY(0)` : `translateY(10px)`,
                transitionDelay: `${index * 100}ms`,
                color: "white", // Ensure text color remains white
              }}
            >
              • {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full mt-2">
        <Button
          variant="outline"
          onClick={onClick}
          className="w-full bg-white text-black hover:bg-gray-100 hover:text-black rounded-lg text-xs py-1"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );

  const handleMouseEnter = (section) => {
    setHoveredSection(section);
  };

  return (
    <div className="flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row space-y-4 md:space-y-0 mt-4 justify-center items-center md:space-x-16">
        {/* Image Generation Section */}
        <div
          className={`w-full md:w-1/3 h-56 bg-white p-2 border-r border-gray-200 bg-cover bg-center rounded-2xl shadow-lg mx-2 overflow-hidden transition-shadow duration-300 ${
            hoveredSection === "Image Generation" ? "hover:shadow-3xl" : ""
          }`}
          style={{
            backgroundImage: "url('/imagesection.jpg')",
            boxShadow:
              hoveredSection === "Image Generation"
                ? "0 10px 30px rgba(0, 0, 0, 0.8)"
                : "0 4px 10px rgba(0, 0, 0, 0.3)",
          }}
          onMouseEnter={() => handleMouseEnter("Image Generation")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <SectionContent
            title="Image Generation"
            subtitle="Create unique images from text prompts using advanced AI"
            listItems={[
              "High-resolution outputs",
              "Various styles and themes",
              "Quick generation time",
            ]}
            buttonText="Generate Images"
            onClick={handleImageGeneration}
            isHovered={hoveredSection === "Image Generation"}
          />
        </div>

        {/* Video Generation Section */}
        <div
          className={`w-full md:w-1/3 h-56 bg-gray-100 p-2 rounded-2xl shadow-lg mx-2 overflow-hidden transition-shadow duration-300 ${
            hoveredSection === "Video Generation" ? "hover:shadow-3xl" : ""
          }`}
          style={{
            backgroundImage: "url('/videosection.jpg')",
            boxShadow:
              hoveredSection === "Video Generation"
                ? "0 10px 30px rgba(0, 0, 0, 0.8)"
                : "0 4px 10px rgba(0, 0, 0, 0.3)",
          }}
          onMouseEnter={() => handleMouseEnter("Video Generation")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <SectionContent
            title="Video Generation"
            subtitle="Bring your stories to life with AI-generated videos"
            listItems={[
              "Custom video durations",
              "Add text and music",
              "Multiple output formats",
            ]}
            buttonText="Create Videos"
            onClick={() => {}}
            isHovered={hoveredSection === "Video Generation"}
          />
        </div>
      </main>
    </div>
  );
};

export default Sections;
