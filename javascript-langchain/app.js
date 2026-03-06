// Import and configure dotenv
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

// Check if GITHUB_TOKEN exists in environment variables
if (!process.env.GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN is missing! Please add it to your .env file.');
  console.error('👉 Example: GITHUB_TOKEN=your_github_token_here');
  process.exit(1); // Exit the process with an error code
}

console.log('✅ Environment variables loaded successfully.');

// Import necessary modules
import { ChatOpenAI } from '@langchain/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Calculator } from '@langchain/community/tools/calculator';
import { DynamicTool } from '@langchain/core/tools';

// Create a ChatOpenAI instance
const chat = new ChatOpenAI({
  model: 'openai/gpt-4o',
  temperature: 0, // Deterministic responses
  apiKey: process.env.GITHUB_TOKEN, // Use GITHUB_TOKEN as the apiKey
  configuration: {
    baseURL: 'https://models.github.ai/inference',
    defaultHeaders: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
});

console.log('🤖 ChatOpenAI instance created successfully.');

// Define the main async function
async function main() {
  console.log('🚀 Starting the LangChain AI Agent application...');

  // Add your application logic here
}

// Define a test query
const testQuery = 'What is 25 * 4 + 10?';

// Call the model's invoke method
async function testModel() {
  try {
    const response = await chat.invoke(testQuery);
    console.log('Response:', response);
  } catch (error) {
    console.error('Error invoking ChatOpenAI:', error);
  }
}

// Execute the main function and handle errors
main().catch(console.error);

// Run the test
await testModel();