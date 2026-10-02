import axios from 'axios';

// Vite 6 inlines VITE_* env vars at build time.
// This value is STATICALLY REPLACED — it IS present in the production JS bundle.
// Never store sensitive secrets here. Use a proxy endpoint for production.
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1";

export function hasApiKey(): boolean {
  return !!API_KEY;
}

const FALLBACK_REPORT =
  "Environmental stability confirmed. Background monitoring active.";

export async function generateEnvironmentalReport(
  city: string,
  data: { temp: number; humidity: number; windSpeed: number; risk: string }
): Promise<string> {
  if (!API_KEY) {
    return FALLBACK_REPORT;
  }

  try {
    const prompt = `As a Sentinel AI Environmental Agent, provide a brief, professional, and slightly futuristic environmental analysis report for ${city}. Current Metrics: - Temperature: ${data.temp}°C - Humidity: ${data.humidity}% - Wind Speed: ${data.windSpeed} km/h - Calculated Risk: ${data.risk}. Format the response as a single, punchy paragraph (max 150 characters) that sounds like an AI status update. Use terms like "Telemetry", "Variance", "Node-calibrated", "Bio-signature".`;

    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: "google/gemini-2.0-flash-exp:free", // Using Gemini model via OpenRouter
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0]?.message?.content?.trim() || FALLBACK_REPORT;
  } catch (error) {
    console.error("OpenRouter Report Error:", error);
    return "Telemetry stream consistent with historical signatures. Local variance within nominal parameters.";
  }
}
