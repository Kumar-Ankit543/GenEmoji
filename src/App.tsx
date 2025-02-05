import { useState } from "react";
import { Sparkles, Copy, Loader2, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import OpenAI from "openai";

const apiKey = import.meta.env.VITE_SOME_KEY;
const openai = apiKey
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

function App() {
  const [prompt, setPrompt] = useState("");
  const [emoji, setEmoji] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEmoji = async () => {
    if (!openai) {
      toast.error(
        "OpenAI API key is not configured. Please add your API key to the .env file."
      );
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt first!");
      return;
    }

    setLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Create a single emoji that represents: ${prompt}. Only respond with the emoji, nothing else.`,
          },
        ],
        max_tokens: 10,
      });

      const generatedEmoji =
        response.choices[0].message.content?.trim() || "❓";
      setEmoji(generatedEmoji);
      toast.success("Emoji generated!");
    } catch (error) {
      console.error("Error generating emoji:", error);
      toast.error("Failed to generate emoji. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (emoji) {
      navigator.clipboard.writeText(emoji);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Emoji Generator
          </h1>
          <p className="text-gray-600">
            Turn your ideas into emojis with AI magic ✨
          </p>
        </div>

        {!openai && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium mb-1">API Key Required</p>
              <p>Please add your OpenAI API key to the .env file:</p>
              <code className="mt-2 block bg-yellow-100 p-2 rounded">
                VITE_OPENAI_API_KEY=your_api_key_here
              </code>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What's your emoji idea?
            </label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., a happy cat eating pizza"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            onClick={generateEmoji}
            disabled={loading || !openai}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span>{loading ? "Generating..." : "Generate Emoji"}</span>
          </button>

          {emoji && (
            <div className="mt-8 text-center">
              <div className="text-6xl mb-4 bg-gray-50 p-6 rounded-lg">
                {emoji}
              </div>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <Copy className="w-4 h-4" />
                <span>Copy to Clipboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;
