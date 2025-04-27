import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function HeroSection() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleNavigation = async (path) => {
    if (!session) {
      await signIn("google");
      return;
    }
    router.push(path);
  };

  return (
    <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl leading-tight mb-6">
        Elevate Your Content with AI Precision.
      </h1>
      <p className="text-gray-400 text-lg md:text-xl max-w-3xl mb-12 leading-relaxed">
        Transform your ideas into stunning visuals with AI-powered tools. Click
        below to start generating.
      </p>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <button
          onClick={() => handleNavigation("/image-generation")}
          className="bg-white text-black hover:bg-gray-100 min-w-[200px] py-3 px-6 rounded-lg text-lg font-semibold"
        >
          Generate Image
        </button>
      </div>
    </main>
  );
}
