import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

// Initialize ChatOpenAI model
const chatModel = new ChatOpenAI({
  model: "gpt-4.1",
  temperature: 0.7,
});

// Define message schemas
const systemMessage = new SystemMessage({
  content: "You are a helpful assistant that translates English to French. Translate the user sentence.",
});

const userMessage = new HumanMessage({
  content: "I love programming."
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