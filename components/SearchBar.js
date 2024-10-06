// SearchBar.js
const SearchBar = ({ prompt, setPrompt, isLoading, handleGenerate }) => {
  return (
    <form onSubmit={handleGenerate} className="w-full max-w-md flex gap-2">
      <input
        type="text"
        placeholder="Describe What You Want To See"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="flex-grow bg-gray-800 border-gray-700 text-white placeholder-gray-400 p-2 rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
      >
        {isLoading ? "Generating..." : "Generate"}
      </button>
    </form>
  );
};

export default SearchBar;
