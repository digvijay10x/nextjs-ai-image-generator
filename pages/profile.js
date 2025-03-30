"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({ name: "", username: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch the user's profile
  useEffect(() => {
    if (session?.user.email) {
      setLoading(true);
      fetch(`/api/profile?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setProfile({
              name: data.name || "",
              username: data.username || "",
              bio: data.bio || "",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, email: session.user.email }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } else {
      setMessage({
        text: data.error || "Failed to update profile.",
        type: "error",
      });
    }

    setLoading(false);
  };

  if (!session)
    return (
      <p className="text-center text-red-500">
        Please log in to create your profile.
      </p>
    );

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold text-center mb-4">Edit Your Profile</h1>

      {message.text && (
        <p
          className={`text-center p-2 rounded-md mb-4 ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Bio Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-all font-medium flex justify-center items-center"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
