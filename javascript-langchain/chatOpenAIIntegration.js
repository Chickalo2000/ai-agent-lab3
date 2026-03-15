import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

// Check if API key exists
if (!process.env.GITHUB_TOKEN && !process.env.OPENAI_API_KEY) {
  console.error(
    "❌ No API key found! Add GITHUB_TOKEN or OPENAI_API_KEY to your .env file.",
  );
  process.exit(1);
}

// Use GITHUB_TOKEN (GitHub API) if available, otherwise OPENAI_API_KEY (OpenAI)
const apiKey = process.env.GITHUB_TOKEN || process.env.OPENAI_API_KEY;
const useGitHub = !!process.env.GITHUB_TOKEN;

// Initialize ChatOpenAI model
const chatModel = new ChatOpenAI({
  model: useGitHub ? "openai/gpt-4o" : "gpt-4o",
  temperature: 0.7,
  apiKey,
  ...(useGitHub && {
    configuration: {
      baseURL: "https://models.github.ai/inference",
      defaultHeaders: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  }),
});

// Define message schemas
const systemMessage = new SystemMessage({
  content:
    "You are a helpful assistant that translates English to Urdu. Translate the user sentence.",
});

const userMessage = new HumanMessage({
  content: "I love programming.",
});

// Invoke the model
async function getTranslation() {
  try {
    const response = await chatModel.invoke([systemMessage, userMessage]);
    console.log("Translation:", response.content);
  } catch (error) {
    console.error("Error invoking ChatOpenAI:", error);
  }
}

getTranslation();