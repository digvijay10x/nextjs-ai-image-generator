import React from "react";
import { Wand2, Image, Trophy, Users, Sparkles, Zap } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white select-none">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-200">
              Transforming Imagination Into Reality
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're building the future of creative expression, where anyone can
            bring their ideas to life through the power of AI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Image className="w-6 h-6 text-blue-400" />}
            title="AI Image Generation"
            description="Transform your text descriptions into stunning visual artwork using state-of-the-art AI technology."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-green-400" />}
            title="Fast Generation"
            description="Create beautiful AI-generated art in seconds with our optimized infrastructure and cutting-edge models."
          />
          <FeatureCard
            icon={<Trophy className="w-6 h-6 text-pink-400" />}
            title="Community Gallery"
            description="Share your creations with the world and discover trending AI-generated art from other creators."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
            title="Upvoting System"
            description="Help surface the best content through community-driven curation and recognition."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6 text-purple-400" />}
            title="Creative Community"
            description="Join a vibrant community of creators pushing the boundaries of AI-powered art."
          />
          <FeatureCard
            icon={<Wand2 className="w-6 h-6 text-orange-400" />}
            title="User-Friendly Interface"
            description="Intuitive tools and helpful suggestions make creation accessible to everyone."
          />
        </div>

        {/* Mission Statement */}
        <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto text-center">
            We believe that creativity shouldn't be limited by technical skills.
            Our platform democratizes digital art creation by providing powerful
            AI tools that turn ideas into reality. We're building a space where
            imagination knows no bounds and where every person can be a creator.
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 select-none cursor-default">
      <div className="bg-gray-700/30 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default AboutUs;
