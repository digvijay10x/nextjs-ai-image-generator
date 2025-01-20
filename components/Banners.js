import React, { useState, useEffect } from "react";

// Image paths from the public folder
const images = [
  "/banner1.jpg",
  "/banner2.jpg",
  "/banner3.jpg",
  "/banner4.jpg", // Add more as needed
];

const Banners = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(null); // Initial touch position

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Handle touch start
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX); // Get initial touch position
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX; // Get final touch position
    const diffX = startX - endX; // Calculate swipe distance

    // Determine swipe direction
    if (diffX > 50) {
      // Swipe left
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    } else if (diffX < -50) {
      // Swipe right
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="flex flex-col">
      <header
        className="relative bg-black text-white py-16 mb-0 h-[200px] overflow-hidden" // Reduced height to 200px
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
            display: "flex",
          }}
        >
          {images.map((image, index) => (
            <div
              key={image}
              className="flex-shrink-0 w-full h-full"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>
        <div className="container mx-auto text-center px-4 relative z-10 flex flex-col justify-center h-full">
          {" "}
          {/* Centering the text */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-2 cursor-default"
            style={{
              textShadow:
                "0.5px 0.5px 0 black, -0.5px -0.5px 0 black, -0.5px 0.5px 0 black, 0.5px -0.5px 0 black", // Further reduced shadow strength
            }}
          >
            AI-Powered Visual Creation
          </h1>
          <p
            className="text-xl mb-0 cursor-default"
            style={{
              textShadow:
                "0.25px 0.25px 0 black, -0.25px -0.25px 0 black, -0.25px 0.25px 0 black, 0.25px -0.25px 0 black", // Further reduced shadow strength
            }}
          >
            Transform your ideas into stunning images and videos
          </p>
        </div>
      </header>
    </div>
  );
};

export default Banners;
