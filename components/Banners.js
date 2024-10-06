import React from "react";

const Banners = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <header className="bg-black text-white py-10 mb-0">
        {" "}
        {/* Removed gap */}
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            AI-Powered Visual Creation
          </h1>
          <p className="text-xl mb-0">
            Transform your ideas into stunning images and videos
          </p>
        </div>
      </header>
    </div>
  );
};

export default Banners;
